import sqlite3

# Connect to DB
conn = sqlite3.connect("leave_management_system.db")
cursor = conn.cursor()

# Ask user for Employee ID
emp_id = input("Enter Employee ID to search: ").strip()

# Fetch employee details
cursor.execute("""
SELECT id, name, gender, age, position, department, phone, email, status
FROM employees
WHERE id = ?
""", (emp_id,))

employee = cursor.fetchone()

if employee:
    id, name, gender, age, position, department, phone, email, status = employee
    print("\nEmployee Details:")
    print("-" * 50)
    print(f"ID: {id}")
    print(f"Name: {name}")
    print(f"Gender: {gender}")
    print(f"Age: {age}")
    print(f"Position: {position}")
    print(f"Department: {department}")
    print(f"Phone: {phone}")
    print(f"Email: {email}")
    print(f"Status: {status}")

    # Fetch leave history
    cursor.execute("""
    SELECT start_date, end_date, leave_days, remaining_days, reason, status, returned, actual_return_date
    FROM leaves
    WHERE employee_id = ?
    ORDER BY start_date DESC
    """, (emp_id,))
    
    leaves = cursor.fetchall()
    
    if leaves:
        print("\nLeave History:")
        print("-" * 80)
        for leave in leaves:
            start_date, end_date, leave_days, remaining_days, reason, status, returned, actual_return_date = leave
            print(f"Start: {start_date}, End: {end_date}, Days: {leave_days}, Remaining: {remaining_days}, Reason: {reason}, Status: {status}, Returned: {returned}, Actual Return: {actual_return_date}")
    else:
        print("\nNo leave history found for this employee.")

else:
    print(f"No employee found with ID: {emp_id}")

# Close connection
conn.close()
