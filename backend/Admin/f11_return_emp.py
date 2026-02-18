import sqlite3
from datetime import datetime

# Connect to DB
conn = sqlite3.connect("leave_management_system.db")
cursor = conn.cursor()

# Today's date
today = datetime.today().date()

# Fetch employees currently on leave
query = """
SELECT e.name, e.position, e.department, e.phone, l.reason, l.end_date
FROM employees e
JOIN leaves l ON e.id = l.employee_id
WHERE l.status = 'Approved' AND l.returned = 'No'
ORDER BY l.end_date
"""

cursor.execute(query)
on_leave = cursor.fetchall()

# Print header
print("Employees Currently On Leave with Expected Return Date:", len(on_leave))
print("-" * 100)

# Print details
for emp in on_leave:
    name, position, department, phone, reason, end_date = emp
    print(f"Name: {name}, Position: {position}, Department: {department}, Phone: {phone}, Reason: {reason}, Expected Return: {end_date}")

# Close connection
conn.close()
