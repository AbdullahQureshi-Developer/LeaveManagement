import sqlite3

# Connect to SQLite DB
conn = sqlite3.connect("leave_management_system.db")
cursor = conn.cursor()

# Join employees & leaves to get current leave info
query = """
SELECT e.name, e.position, l.start_date, l.end_date, l.applied_on, l.reason
FROM employees e
JOIN leaves l ON e.id = l.employee_id
WHERE l.status = 'Approved' AND l.returned = 'No'
ORDER BY l.start_date
"""
cursor.execute(query)
on_leave = cursor.fetchall()

# Print header
print("Employees Currently On Leave:", len(on_leave))
print("-" * 80)

# Print leave details
for row in on_leave:
    name, position, start_date, end_date, applied_on, reason = row
    print(f"Name: {name}, Position: {position}, Start: {start_date}, End: {end_date}, Applied On: {applied_on}, Reason: {reason}")

# Close connection
conn.close()
