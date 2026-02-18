import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';

interface UserSession {
  token: string;
  role: string;
  username: string;
}

function App() {
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to parse user session", e);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = (userData: UserSession) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen text-muted">Loading application...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={user ? <Navigate to={user.role === 'admin' ? '/admin' : '/employee'} /> : <LoginPage onLogin={login} />}
        />

        {/* Protected Admin Routes */}
        <Route
          path="/admin/*"
          element={
            user?.role === 'admin' ? (
              <AdminDashboard user={user} onLogout={logout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Protected Employee Routes */}
        <Route
          path="/employee/*"
          element={
            user?.role === 'employee' ? (
              <EmployeeDashboard user={user} onLogout={logout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Default Redirect */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
