import sqlite3

# Connect to DB
conn = sqlite3.connect("leave_management_system.db")
cursor = conn.cursor()

# Fetch leave records with employee info
query = """
SELECT e.name, e.position, e.department, l.leave_id, l.reason, l.leave_days
FROM employees e
JOIN leaves l ON e.id = l.employee_id
ORDER BY e.id, l.start_date
"""

cursor.execute(query)
leaves = cursor.fetchall()

# Print header
print("Employee Leave Details:")
print("-" * 100)

# Track leave number per employee
leave_count = {}
for leave in leaves:
    name, position, department, leave_id, reason, leave_days = leave
    leave_count[name] = leave_count.get(name, 0) + 1
    print(f"Name: {name}, Position: {position}, Department: {department}, Leave #{leave_count[name]}, Reason: {reason}, Leave Days: {leave_days}")

# Close connection
conn.close()
