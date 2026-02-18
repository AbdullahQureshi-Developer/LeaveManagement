import sqlite3
from datetime import datetime

# Connect to DB
conn = sqlite3.connect("leave_management_system.db")
cursor = conn.cursor()

# Today's date
today = datetime.today().date()

# Query for overdue employees
query = """
SELECT e.name, e.position, e.department, e.phone, e.email, l.reason, l.end_date
FROM employees e
JOIN leaves l ON e.id = l.employee_id
WHERE l.status = 'Approved'
  AND l.returned = 'No'
  AND l.end_date < ?
ORDER BY l.end_date
"""

cursor.execute(query, (today,))
overdue_employees = cursor.fetchall()

# Print header
print("Employees with Overdue Returns:", len(overdue_employees))
print("-" * 80)

# Print details
for emp in overdue_employees:
    name, position, department, phone, email, reason, end_date = emp
    print(f"Name: {name}, Position: {position}, Department: {department}, Phone: {phone}, Email: {email}, Reason: {reason}, End Date: {end_date}")

# Close connection
conn.close()
