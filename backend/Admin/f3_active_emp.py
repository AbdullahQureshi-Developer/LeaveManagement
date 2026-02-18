import sqlite3
from datetime import datetime

# Connect to DB
conn = sqlite3.connect("leave_management_system.db")
cursor = conn.cursor()

# Get today's date
today = datetime.today().date()

# Fetch employees who are currently present
query = """
SELECT e.name, e.position, e.department, e.phone, e.email
FROM employees e
LEFT JOIN leaves l ON e.id = l.employee_id
WHERE (l.status IS NULL 
       OR l.returned = 'Yes' 
       OR l.end_date < ?)
GROUP BY e.id
ORDER BY e.name
"""

cursor.execute(query, (today,))
present_employees = cursor.fetchall()

# Print header
print("Employees Currently Present:", len(present_employees))
print("-" * 80)

# Print details
for emp in present_employees:
    name, position, department, phone, email = emp
    print(f"Name: {name}, Position: {position}, Department: {department}, Phone: {phone}, Email: {email}")

# Close connection
conn.close()
