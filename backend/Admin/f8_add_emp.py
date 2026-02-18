import sqlite3
from werkzeug.security import generate_password_hash
import random

# Connect to DB
conn = sqlite3.connect("leave_management_system.db")
cursor = conn.cursor()

print("Enter new employee details:")

name = input("Full Name: ").strip()
gender = input("Gender (Male/Female): ").strip()
age = int(input("Age: ").strip())
position = input("Position: ").strip()
department = input("Department: ").strip()
phone = input("Phone (e.g., +923001234567): ").strip()
email = input("Email: ").strip()
status = input("Status (Active/On Leave): ").strip()

# Insert into employees table
cursor.execute("""
INSERT INTO employees (name, gender, age, position, department, phone, email, status)
VALUES (?, ?, ?, ?, ?, ?, ?, ?)
""", (name, gender, age, position, department, phone, email, status))
conn.commit()

# Get the new employee ID
employee_id = cursor.lastrowid

# Create employee login
username = f"user{employee_id}"
password_plain = f"pass{employee_id}"  # default password
password_hashed = generate_password_hash(password_plain)

cursor.execute("""
INSERT INTO employee_users (employee_id, username, password)
VALUES (?, ?, ?)
""", (employee_id, username, password_hashed))

conn.commit()
conn.close()

print("\nNew employee added successfully!")
print(f"Employee ID: {employee_id}")
print(f"Username: {username}")
print(f"Password: {password_plain}")
