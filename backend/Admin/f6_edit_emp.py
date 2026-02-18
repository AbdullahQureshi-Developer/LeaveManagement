import sqlite3

# Connect to DB
conn = sqlite3.connect("leave_management_system.db")
cursor = conn.cursor()

# Ask admin for employee ID to edit
emp_id = input("Enter Employee ID to edit: ").strip()

# Fetch current details
cursor.execute("""
SELECT name, gender, age, position, department, phone, email, status
FROM employees
WHERE id = ?
""", (emp_id,))
employee = cursor.fetchone()

if not employee:
    print(f"No employee found with ID: {emp_id}")
else:
    name, gender, age, position, department, phone, email, status = employee
    print("\nCurrent Employee Details:")
    print("-" * 50)
    print(f"Name: {name}")
    print(f"Gender: {gender}")
    print(f"Age: {age}")
    print(f"Position: {position}")
    print(f"Department: {department}")
    print(f"Phone: {phone}")
    print(f"Email: {email}")
    print(f"Status: {status}")
    
    print("\nEnter new values (leave blank to keep current):")
    
    new_name = input(f"Name [{name}]: ") or name
    new_gender = input(f"Gender [{gender}]: ") or gender
    new_age = input(f"Age [{age}]: ") or age
    new_position = input(f"Position [{position}]: ") or position
    new_department = input(f"Department [{department}]: ") or department
    new_phone = input(f"Phone [{phone}]: ") or phone
    new_email = input(f"Email [{email}]: ") or email
    new_status = input(f"Status [{status}]: ") or status

    # Update in DB
    cursor.execute("""
    UPDATE employees
    SET name = ?, gender = ?, age = ?, position = ?, department = ?, phone = ?, email = ?, status = ?
    WHERE id = ?
    """, (new_name, new_gender, new_age, new_position, new_department, new_phone, new_email, new_status, emp_id))
    
    conn.commit()
    print("\nEmployee details updated successfully!")

# Close connection
conn.close()
