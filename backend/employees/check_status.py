import sqlite3

def check_status():
    conn = sqlite3.connect("leave_management_system.db")
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    try:
        print("\n--- CHECK LEAVE STATUS ---")
        emp_id = input("Enter Employee ID: ").strip()
        
        # Verify Employee Exists
        cursor.execute("SELECT username FROM employee_users WHERE employee_id = ?", (emp_id,))
        if not cursor.fetchone():
            print(f"Error: Employee ID {emp_id} not found.")
            return

        # Get Latest Leave
        cursor.execute("SELECT * FROM leaves WHERE employee_id = ? ORDER BY leave_id DESC LIMIT 1", (emp_id,))
        latest_leave = cursor.fetchone()

        if not latest_leave:
            print("No leave records found.")
            print("Current Balance: 20 days")
        else:
            print(f"\nLatest Leave Status for Employee {emp_id}:")
            print(f"Status: {latest_leave['status']}")
            print(f"Remaining Days: {latest_leave['remaining_days']}")
            print(f"Expected Return Date: {latest_leave['end_date']}") 
            # Note: Ideally return date is end_date + 1, but keeping simple as per request logic

    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    check_status()
