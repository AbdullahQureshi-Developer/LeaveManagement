import sqlite3
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime
from functools import wraps

app = Flask(__name__)
CORS(app)
app.config['SECRET_KEY'] = 'your_secret_key_here'  # In a real app, use an environment variable

import os

# Get the directory where the script is located
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# The DB is located in the root (one level up from backend/)
DB_PATH = os.path.join(BASE_DIR, '..', 'leave_management_system.db')

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

# --- Authentication Decorator ---
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        try:
            # Token usually comes as "Bearer <token>"
            if token.startswith('Bearer '):
                token = token.split(' ')[1]
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = data
        except Exception as e:
            return jsonify({'message': 'Token is invalid!', 'error': str(e)}), 401
        return f(current_user, *args, **kwargs)
    return decorated

# --- Routes ---

@app.route('/api/login', methods=['POST'])
def login():
    auth = request.json
    if not auth or not auth.get('username') or not auth.get('password'):
        return jsonify({'message': 'Missing username or password'}), 400

    username = auth.get('username')
    password = auth.get('password')

    # Quick check for Admin (as per hardcoded requirements in prompt)
    if username == 'admin' and password == 'admin123':
        token = jwt.encode({
            'user': 'admin',
            'role': 'admin',
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }, app.config['SECRET_KEY'])
        return jsonify({'token': token, 'role': 'admin', 'username': 'admin'})

    # Check for Employee
    conn = get_db_connection()
    user = conn.execute('SELECT * FROM employee_users WHERE username = ?', (username,)).fetchone()
    conn.close()

    if user and check_password_hash(user['password'], password):
        token = jwt.encode({
            'user_id': user['employee_id'],
            'username': user['username'],
            'role': 'employee',
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }, app.config['SECRET_KEY'])
        return jsonify({'token': token, 'role': 'employee', 'username': user['username'], 'employee_id': user['employee_id']})

    # Fallback for employees that might have plain passwords (if not hashed yet in DB)
    if user and user['password'] == password:
         token = jwt.encode({
            'user_id': user['employee_id'],
            'username': user['username'],
            'role': 'employee',
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }, app.config['SECRET_KEY'])
         return jsonify({'token': token, 'role': 'employee', 'username': user['username'], 'employee_id': user['employee_id']})

    return jsonify({'message': 'Invalid credentials'}), 401

# --- Admin Endpoints ---

@app.route('/api/admin/employees', methods=['GET'])
@token_required
def get_all_employees(current_user):
    if current_user['role'] != 'admin':
        return jsonify({'message': 'Unauthorized'}), 403
    
    conn = get_db_connection()
    employees = conn.execute('SELECT * FROM employees').fetchall()
    conn.close()
    
    return jsonify([dict(row) for row in employees])

@app.route('/api/admin/employees', methods=['POST'])
@token_required
def add_employee(current_user):
    if current_user['role'] != 'admin':
        return jsonify({'message': 'Unauthorized'}), 403

    data = request.json
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO employees (name, gender, age, position, department, phone, email, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (data['name'], data['gender'], data['age'], data['position'], 
              data['department'], data['phone'], data['email'], data['status']))
        
        emp_id = cursor.lastrowid
        username = f"user{emp_id}"
        pass_plain = f"pass{emp_id}"
        pass_hashed = generate_password_hash(pass_plain)
        
        cursor.execute("INSERT INTO employee_users (employee_id, username, password) VALUES (?, ?, ?)", 
                       (emp_id, username, pass_hashed))
        
        conn.commit()
        conn.close()
        return jsonify({'message': 'Employee added', 'id': emp_id, 'username': username, 'password': pass_plain}), 210
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/admin/employees/<int:emp_id>', methods=['PATCH'])
@token_required
def update_employee(current_user, emp_id):
    if current_user['role'] != 'admin':
        return jsonify({'message': 'Unauthorized'}), 403
    
    data = request.json
    try:
        conn = get_db_connection()
        # Build update query dynamically based on provided fields
        update_fields = []
        values = []
        
        if 'name' in data:
            update_fields.append('name = ?')
            values.append(data['name'])
        if 'position' in data:
            update_fields.append('position = ?')
            values.append(data['position'])
        if 'department' in data:
            update_fields.append('department = ?')
            values.append(data['department'])
        if 'email' in data:
            update_fields.append('email = ?')
            values.append(data['email'])
        if 'status' in data:
            update_fields.append('status = ?')
            values.append(data['status'])
        
        if not update_fields:
            return jsonify({'message': 'No fields to update'}), 400
        
        values.append(emp_id)
        query = f"UPDATE employees SET {', '.join(update_fields)} WHERE id = ?"
        
        conn.execute(query, values)
        conn.commit()
        conn.close()
        
        return jsonify({'message': 'Employee updated successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/admin/employees/<int:emp_id>', methods=['GET'])
@token_required
def get_employee_details(current_user, emp_id):
    if current_user['role'] != 'admin':
        return jsonify({'message': 'Unauthorized'}), 403
    
    conn = get_db_connection()
    try:
        # Fetch employee details
        employee = conn.execute('SELECT * FROM employees WHERE id = ?', (emp_id,)).fetchone()
        if not employee:
            return jsonify({'message': 'Employee not found'}), 404
            
        # Fetch leave history for this employee
        leaves = conn.execute('SELECT * FROM leaves WHERE employee_id = ? ORDER BY start_date DESC', (emp_id,)).fetchall()
        
        emp_data = dict(employee)
        emp_data['leave_history'] = [dict(row) for row in leaves]
        
        return jsonify(emp_data)
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    finally:
        conn.close()

@app.route('/api/admin/employees/<int:emp_id>', methods=['DELETE'])
@token_required
def delete_employee(current_user, emp_id):
    if current_user['role'] != 'admin':
        return jsonify({'message': 'Unauthorized'}), 403
    
    conn = get_db_connection()
    try:
        # Check if employee exists
        employee = conn.execute('SELECT name FROM employees WHERE id = ?', (emp_id,)).fetchone()
        if not employee:
            return jsonify({'message': 'Employee not found'}), 404
            
        # Delete related leaves first
        conn.execute('DELETE FROM leaves WHERE employee_id = ?', (emp_id,))
        # Delete user login
        conn.execute('DELETE FROM employee_users WHERE employee_id = ?', (emp_id,))
        # Delete employee record
        conn.execute('DELETE FROM employees WHERE id = ?', (emp_id,))
        
        conn.commit()
        return jsonify({'message': f"Employee {employee['name']} deleted successfully"}), 200
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 400
    finally:
        conn.close()

@app.route('/api/admin/leaves', methods=['GET'])
@token_required
def get_all_leaves(current_user):
    if current_user['role'] != 'admin':
        return jsonify({'message': 'Unauthorized'}), 403
    
    conn = get_db_connection()
    leaves = conn.execute("""
        SELECT l.*, e.name as employee_name 
        FROM leaves l 
        JOIN employees e ON l.employee_id = e.id
    """).fetchall()
    conn.close()
    
    return jsonify([dict(row) for row in leaves])

@app.route('/api/admin/leaves/<int:leave_id>', methods=['PATCH'])
@token_required
def update_leave_status(current_user, leave_id):
    if current_user['role'] != 'admin':
        return jsonify({'message': 'Unauthorized'}), 403
    
    data = request.json
    status = data.get('status') # 'Approved' or 'Rejected'
    returned = 'No' if status == 'Approved' else 'Yes'
    
    conn = get_db_connection()
    conn.execute("UPDATE leaves SET status = ?, returned = ? WHERE leave_id = ?", (status, returned, leave_id))
    conn.commit()
    conn.close()
    
    return jsonify({'message': f'Leave {status.lower()}'})

# --- Employee Endpoints ---

@app.route('/api/employee/profile', methods=['GET'])
@token_required
def get_employee_profile(current_user):
    emp_id = current_user.get('user_id')
    if not emp_id:
        return jsonify({'message': 'Employee ID not found in token'}), 400
        
    conn = get_db_connection()
    profile = conn.execute('SELECT * FROM employees WHERE id = ?', (emp_id,)).fetchone()
    # Get leave balance (most recent remaining_days)
    last_leave = conn.execute('SELECT remaining_days FROM leaves WHERE employee_id = ? ORDER BY leave_id DESC LIMIT 1', (emp_id,)).fetchone()
    conn.close()
    
    if profile:
        data = dict(profile)
        data['leave_balance'] = last_leave['remaining_days'] if last_leave else 20
        return jsonify(data)
    return jsonify({'message': 'Profile not found'}), 404

@app.route('/api/employee/leaves', methods=['GET'])
@token_required
def get_employee_leaves(current_user):
    emp_id = current_user.get('user_id')
    conn = get_db_connection()
    leaves = conn.execute('SELECT * FROM leaves WHERE employee_id = ? ORDER BY applied_on DESC', (emp_id,)).fetchall()
    conn.close()
    return jsonify([dict(row) for row in leaves])

@app.route('/api/employee/leaves', methods=['POST'])
@token_required
def apply_leave(current_user):
    emp_id = current_user.get('user_id')
    data = request.json
    
    # Simple logic ported from apply_leave.py
    conn = get_db_connection()
    last_leave = conn.execute('SELECT remaining_days FROM leaves WHERE employee_id = ? ORDER BY leave_id DESC LIMIT 1', (emp_id,)).fetchone()
    current_balance = last_leave['remaining_days'] if last_leave else 20
    
    leave_days = data.get('leave_days')
    if leave_days > current_balance:
        return jsonify({'message': 'Insufficient balance'}), 400
        
    applied_on = datetime.datetime.now().strftime('%Y-%m-%d')
    new_balance = current_balance - leave_days
    
    conn.execute('''
        INSERT INTO leaves (employee_id, start_date, end_date, leave_days, remaining_days, reason, status, returned, applied_on)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (emp_id, data['start_date'], data['end_date'], leave_days, new_balance, data['reason'], 'Pending', 'No', applied_on))
    
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Leave applied successfully', 'new_balance': new_balance})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
