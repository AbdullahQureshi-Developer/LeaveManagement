import sqlite3

# Connect to SQLite DB
conn = sqlite3.connect("leave_management_system.db")
cursor = conn.cursor()

# Fetch all employees
cursor.execute("SELECT name, position, department, phone, email FROM employees")
employees = cursor.fetchall()

# Print header
print("Total Employees in Company:", len(employees))
print("-" * 80)

# Print employee details
for emp in employees:
    name, position, department, phone, email = emp
    print(f"Name: {name}, Position: {position}, Department: {department}, Phone: {phone}, Email: {email}")

# Close connection
conn.close()
