import sqlite3
from datetime import datetime, timedelta

def notifications():
    # Connect to SQLite DB
    conn = sqlite3.connect("leave_management_system.db")
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    try:
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
            return

        status = latest_leave['status']
        print(f"\n--- LEAVE NOTIFICATION ---")
        print(f"Leave Status: {status}")

        if status == 'Approved':
            end_date_str = latest_leave['end_date']
            try:
                # Assuming date format is YYYY-MM-DD
                end_date = datetime.strptime(end_date_str, "%Y-%m-%d")
                return_date = end_date + timedelta(days=1)
                print(f"Return Reminder: Please return to work on {return_date.strftime('%Y-%m-%d')}")
            except ValueError:
                # Fallback if date format is different
                print(f"Return Reminder: Please return after {end_date_str}")

        elif status == 'Rejected':
             print("Alert: Your leave application was rejected. Please contact HR.")
        
        elif status == 'Pending':
            print("Alert: Your leave application is currently pending approval.")

    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    notifications()
