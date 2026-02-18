import sqlite3

# Connect to DB
conn = sqlite3.connect("leave_management_system.db")
cursor = conn.cursor()

# Fetch pending leave requests
query = """
SELECT e.id, e.name, e.position, e.department, e.phone, l.leave_days, l.reason, l.status
FROM employees e
JOIN leaves l ON e.id = l.employee_id
WHERE l.status = 'Pending'
ORDER BY l.applied_on
"""

cursor.execute(query)
pending_leaves = cursor.fetchall()

# Print header
print("Pending Leave Requests:", len(pending_leaves))
print("-" * 100)

# Print details
for leave in pending_leaves:
    emp_id, name, position, department, phone, leave_days, reason, status = leave
    print(f"ID: {emp_id}, Name: {name}, Position: {position}, Department: {department}, Phone: {phone}, Leave Days: {leave_days}, Reason: {reason}, Status: {status}")

# Close connection
conn.close()
