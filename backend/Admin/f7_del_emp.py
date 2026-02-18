import sqlite3

# Connect to DB
conn = sqlite3.connect("leave_management_system.db")
cursor = conn.cursor()

# Ask for Employee ID
emp_id = input("Enter Employee ID to delete: ").strip()

# Check if employee exists
cursor.execute("SELECT name FROM employees WHERE id = ?", (emp_id,))
employee = cursor.fetchone()

if not employee:
    print(f"No employee found with ID: {emp_id}")
else:
    name = employee[0]
    confirm = input(f"Are you sure you want to delete {name}? (yes/no): ").strip().lower()
    if confirm == "yes":
        # Delete from leaves first (foreign key)
        cursor.execute("DELETE FROM leaves WHERE employee_id = ?", (emp_id,))
        # Delete from employee_users table
        cursor.execute("DELETE FROM employee_users WHERE employee_id = ?", (emp_id,))
        # Delete from employees
        cursor.execute("DELETE FROM employees WHERE id = ?", (emp_id,))
        conn.commit()
        print(f"Employee {name} (ID: {emp_id}) has been deleted successfully!")
    else:
        print("Deletion canceled.")

# Close connection
conn.close()
