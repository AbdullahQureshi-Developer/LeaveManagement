# Leave Management System

A comprehensive Full Stack Leave Management System designed to streamline employee leave tracking and administrative workflows. This project features a modern React frontend with a premium glassmorphic UI and a robust Python/Flask backend.

## 🚀 Key Features

### For Employees
- **Personal Dashboard:** View leave balance and request history.
- **Leave Application:** Submit leave requests with specific dates and reasons.
- **Real-time Balance:** Automatically calculated leave days remaining.

### For Administrators
- **Employee Management:** Add, update, and delete employee records.
- **Leave Oversight:** Review, approve, or reject pending leave requests.
- **Analytics:** View employees currently on leave and those who have returned.

## 🛠️ Technology Stack

- **Frontend:** React, TypeScript, Vite, Vanilla CSS (Glassmorphism).
- **Backend:** Python, Flask, Flask-CORS.
- **Database:** SQLite3.
- **Security:** JWT (JSON Web Tokens) for authentication, Password Hashing.

## 📦 Project Structure

```bash
leaveManage/
├── backend/            # Flask API & Admin/Employee modules
│   └── server.py       # Main backend entry point
├── frontend/           # React + Vite application
│   └── src/            # Components, Pages, and Assets
├── leave_management_system.db  # SQLite database
└── README.md           # This file
```

## 🛠️ Setup Instructions

### Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Start the Flask server:
   ```bash
   python server.py
   ```
   *The API will be available at `http://localhost:5000`*

### Frontend Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   *The application will be available at `http://localhost:5173`*

## 🔑 Authentication
- **Admin:** `admin` / `admin123`
- **Employees:** Usernames and passwords are automatically generated upon employee creation (e.g., `user1` / `pass1`).

## 📡 API Endpoints Summary
- `POST /api/login`: User authentication.
- `GET /api/admin/employees`: Fetch all employees (Admin).
- `POST /api/employee/leaves`: Submit a leave request (Employee).
- `PATCH /api/admin/leaves/<id>`: Approve/Reject leave (Admin).