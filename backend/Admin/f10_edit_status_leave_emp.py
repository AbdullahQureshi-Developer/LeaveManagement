import sqlite3

# Connect to DB
conn = sqlite3.connect("leave_management_system.db")
cursor = conn.cursor()

# Ask admin for Employee ID
emp_id = input("Enter Employee ID to approve/reject leave: ").strip()

# Fetch pending leave for this employee
cursor.execute("""
SELECT l.leave_id, e.name, e.position, e.department, e.phone, l.leave_days, l.reason, l.status
FROM employees e
JOIN leaves l ON e.id = l.employee_id
WHERE e.id = ? AND l.status = 'Pending'
""", (emp_id,))

leave_record = cursor.fetchone()

if not leave_record:
    print(f"No pending leave found for Employee ID: {emp_id}")
else:
    leave_id, name, position, department, phone, leave_days, reason, status = leave_record
    print("\nPending Leave Details:")
    print("-" * 80)
    print(f"Name: {name}")
    print(f"Position: {position}")
    print(f"Department: {department}")
    print(f"Phone: {phone}")
    print(f"Leave Days: {leave_days}")
    print(f"Reason: {reason}")
    print(f"Status: {status}")

    # Ask admin for action
    action = input("\nDo you want to Approve or Reject this leave? (A/R): ").strip().upper()
    if action == "A":
        new_status = "Approved"
        returned = "No"  # once approved, leave is active
        cursor.execute("""
        UPDATE leaves
        SET status = ?, returned = ?
        WHERE leave_id = ?
        """, (new_status, returned, leave_id))
        conn.commit()
        print(f"\nLeave for {name} has been APPROVED.")
    elif action == "R":
        new_status = "Rejected"
        returned = "Yes"
        cursor.execute("""
        UPDATE leaves
        SET status = ?, returned = ?
        WHERE leave_id = ?
        """, (new_status, returned, leave_id))
        conn.commit()
        print(f"\nLeave for {name} has been REJECTED.")
    else:
        print("Invalid input. No changes made.")

# Close connection
conn.close()
