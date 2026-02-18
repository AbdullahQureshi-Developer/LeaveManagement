import sqlite3
from datetime import datetime

def apply_leave():
    conn = sqlite3.connect("leave_management_system.db")
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    try:
        print("\n--- APPLY FOR LEAVE ---")
        emp_id = input("Enter Employee ID: ").strip()
        
        # Verify Employee Exists
        cursor.execute("SELECT username FROM employee_users WHERE employee_id = ?", (emp_id,))
        if not cursor.fetchone():
            print(f"Error: Employee ID {emp_id} not found.")
            return

        start_date_str = input("Enter Start Date (YYYY-MM-DD): ").strip()
        end_date_str = input("Enter End Date (YYYY-MM-DD): ").strip()
        reason = input("Enter Reason: ").strip()

        # Validate Dates
        try:
            start_date = datetime.strptime(start_date_str, '%Y-%m-%d').date()
            end_date = datetime.strptime(end_date_str, '%Y-%m-%d').date()
            
            leave_days = (end_date - start_date).days + 1
            
            if leave_days <= 0:
                print("Error: End date must be after start date.")
                return
        except ValueError:
            print("Error: Invalid date format. Please use YYYY-MM-DD.")
            return

        # Check Balance
        cursor.execute("SELECT remaining_days FROM leaves WHERE employee_id = ? ORDER BY leave_id DESC LIMIT 1", (emp_id,))
        last_leave = cursor.fetchone()
        current_balance = last_leave['remaining_days'] if last_leave else 20
        
        if leave_days > current_balance:
            print(f"Error: Insufficient leave balance. You have {current_balance} days, requested {leave_days}.")
            return

        new_balance = current_balance - leave_days
        applied_on = datetime.now().strftime('%Y-%m-%d')

        # Insert Leave
        cursor.execute('''
            INSERT INTO leaves (employee_id, start_date, end_date, leave_days, remaining_days, reason, status, returned, applied_on)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (emp_id, start_date_str, end_date_str, leave_days, new_balance, reason, 'Pending', 'No', applied_on))
        
        conn.commit()
        print("\nSUCCESS: Leave application submitted!")
        print(f"New Balance: {new_balance} days")

    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    apply_leave()
