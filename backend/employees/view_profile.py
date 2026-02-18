import sqlite3
import sys

def view_profile():
    # Connect to SQLite DB
    conn = sqlite3.connect("leave_management_system.db")
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    try:
        emp_id = input("Enter Employee ID: ").strip()
        
        # Get User Info
        cursor.execute("SELECT username FROM employee_users WHERE employee_id = ?", (emp_id,))
        user_row = cursor.fetchone()
        
        if not user_row:
            print(f"Error: Employee ID {emp_id} not found.")
            return

        username = user_row['username']
        
        # Get Leave History and Calculate Balance
        cursor.execute("SELECT * FROM leaves WHERE employee_id = ? ORDER BY leave_id DESC", (emp_id,))
        leaves = cursor.fetchall()
        
        # Determine remaining days from latest leave
        remaining_days = 20 # Default
        if leaves:
            remaining_days = leaves[0]['remaining_days']

        print("\n" + "="*40)
        print(f" EMPLOYEE PROFILE: {username} (ID: {emp_id})")
        print("="*40)
        print(f"Remaining Leave Balance: {remaining_days} days")
        print("-" * 40)
        print("LEAVE HISTORY:")
        print(f"{'Start Date':<12} | {'End Date':<12} | {'Days':<5} | {'Status':<10} | {'Reason'}")
        print("-" * 60)
        
        if not leaves:
            print("No leave history found.")
        else:
            for leave in leaves:
                print(f"{leave['start_date']:<12} | {leave['end_date']:<12} | {leave['leave_days']:<5} | {leave['status']:<10} | {leave['reason']}")
                
        print("="*40 + "\n")

    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    view_profile()
