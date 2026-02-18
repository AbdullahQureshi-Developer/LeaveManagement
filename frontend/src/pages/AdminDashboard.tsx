import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LogOut, Users, FileText, Plus, CheckCircle, XCircle, UserCircle, Search, X, Edit, Trash2, Clock, Calendar, BarChart2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = 'http://localhost:5000/api';

interface AdminDashboardProps {
    user: { token: string; username: string; role: string };
    onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onLogout }) => {
    const [employees, setEmployees] = useState<any[]>([]);
    const [leaves, setLeaves] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'dashboard' | 'employees' | 'leaves'>('dashboard');
    const [searchQuery, setSearchQuery] = useState('');

    // Modals
    const [editingEmployee, setEditingEmployee] = useState<any>(null);
    const [viewingEmployee, setViewingEmployee] = useState<any>(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);

    // Stats
    const [stats, setStats] = useState({
        total: 0,
        active: 0,
        onLeave: 0,
        pendingReturns: 0
    });

    const [newEmployee, setNewEmployee] = useState<any>({
        name: '',
        gender: 'Male',
        age: '',
        position: '',
        department: '',
        phone: '',
        email: '',
        status: 'Active'
    });

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const headers = { Authorization: `Bearer ${user.token}` };
            const [empRes, leaveRes] = await Promise.all([
                axios.get(`${API_URL}/admin/employees`, { headers }),
                axios.get(`${API_URL}/admin/leaves`, { headers })
            ]);

            const allEmployees = empRes.data;
            const allLeaves = leaveRes.data;

            setEmployees(allEmployees);
            setLeaves(allLeaves);

            const total = allEmployees.length;
            let onLeaveCount = 0;

            allLeaves.forEach((l: any) => {
                if (l.status === 'Approved' && l.returned === 'No') {
                    onLeaveCount++;
                }
            });

            const activeCount = total - onLeaveCount;
            setStats({ total, active: activeCount, onLeave: onLeaveCount, pendingReturns: onLeaveCount });

        } catch (err) {
            console.error('Error fetching data', err);
        } finally {
            setLoading(false);
        }
    };

    const updateLeaveStatus = async (leaveId: number, status: 'Approved' | 'Rejected') => {
        try {
            const headers = { Authorization: `Bearer ${user.token}` };
            await axios.patch(`${API_URL}/admin/leaves/${leaveId}`, { status }, { headers });
            fetchData();
        } catch (err) {
            console.error('Error updating status', err);
        }
    };

    const handleEditEmployee = (employee: any) => {
        setEditingEmployee({ ...employee });
        setShowEditModal(true);
    };

    const handleDeleteEmployee = async (id: number, name: string) => {
        if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;
        try {
            const headers = { Authorization: `Bearer ${user.token}` };
            await axios.delete(`${API_URL}/admin/employees/${id}`, { headers });
            fetchData();
        } catch (err) {
            console.error('Error deleting', err);
        }
    };

    const handleSaveEmployee = async () => {
        try {
            const headers = { Authorization: `Bearer ${user.token}` };
            await axios.patch(`${API_URL}/admin/employees/${editingEmployee.id}`, editingEmployee, { headers });
            setShowEditModal(false);
            setEditingEmployee(null);
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddEmployee = async () => {
        try {
            const headers = { Authorization: `Bearer ${user.token}` };
            await axios.post(`${API_URL}/admin/employees`, newEmployee, { headers });
            setShowAddModal(false);
            setNewEmployee({ name: '', gender: 'Male', age: '', position: '', department: '', phone: '', email: '', status: 'Active' });
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    const handleViewEmployee = async (employee: any) => {
        try {
            const headers = { Authorization: `Bearer ${user.token}` };
            const res = await axios.get(`${API_URL}/admin/employees/${employee.id}`, { headers });
            setViewingEmployee(res.data);
            setShowViewModal(true);
        } catch (err) {
            console.error(err);
        }
    };

    const filteredEmployees = employees.filter(emp =>
        emp.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.position?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.department?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredLeaves = leaves.filter(leave =>
        leave.employee_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        leave.status?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const pendingReturns = leaves.filter(l => {
        return l.status === 'Approved' && l.returned === 'No';
    });

    const activeLeaves = leaves.filter(l => l.status === 'Approved' && l.returned === 'No');

    return (
        <div className="h-screen flex items-center justify-center relative overflow-hidden" style={{
            background: '#0ea5e9',
            fontFamily: "'Outfit', sans-serif"
        }}>
            {/* Backgrounds */}
            <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                backgroundImage: 'url("/image/university.png")',
                backgroundSize: 'cover', backgroundPosition: 'center', zIndex: 0
            }} />
            <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.6) 0%, rgba(15, 23, 42, 0.8) 100%)',
                zIndex: 1
            }} />

            {/* Main Container */}
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                style={{
                    position: 'relative', zIndex: 2,
                    width: '96vw', height: '92vh',
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '40px',
                    boxShadow: '0 50px 100px rgba(0, 0, 0, 0.5)',
                    display: 'flex', overflow: 'hidden',
                    border: '1px solid rgba(255, 255, 255, 0.3)'
                }}
            >
                {/* Sidebar */}
                <div style={{
                    width: '300px',
                    background: 'linear-gradient(180deg, rgba(14, 165, 233, 0.95) 0%, rgba(2, 132, 199, 1) 100%)',
                    display: 'flex', flexDirection: 'column',
                    boxShadow: '10px 0 30px rgba(0, 0, 0, 0.1)',
                    position: 'relative', zIndex: 10,
                    borderRight: '1px solid rgba(255, 255, 255, 0.1)',
                    overflowY: 'auto'
                }}>
                    <div style={{ padding: '3rem 2rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                        <div style={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center',
                            textAlign: 'center', gap: '1.25rem'
                        }}>
                            <div style={{
                                width: '80px', height: '80px', borderRadius: '24px', background: 'white',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: '0 15px 35px rgba(0,0,0,0.2)'
                            }}>
                                <UserCircle size={48} color="#0ea5e9" />
                            </div>
                            <div>
                                <h3 style={{ color: 'white', fontWeight: '800', fontSize: '1.25rem', marginBottom: '0.25rem' }}>
                                    {user.username}
                                </h3>
                                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.875rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    Administrator
                                </p>
                            </div>
                        </div>
                    </div>

                    <div style={{ flex: 1, padding: '2rem 0' }}>
                        <div style={{ padding: '0 2rem', marginBottom: '1rem' }}>
                            <span style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                Admin Menu
                            </span>
                        </div>
                        {[
                            { id: 'dashboard', icon: BarChart2, label: 'Overview' },
                            { id: 'employees', icon: Users, label: 'Staff Records' },
                            { id: 'leaves', icon: FileText, label: 'Leave Control' }
                        ].map(item => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id as any)}
                                style={{
                                    width: '100%', padding: '1rem 2rem', display: 'flex', alignItems: 'center', gap: '1rem',
                                    background: activeTab === item.id ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                                    border: 'none', color: 'white', cursor: 'pointer', transition: 'all 0.3s',
                                    fontWeight: '700', fontSize: '1rem',
                                    borderLeft: activeTab === item.id ? '6px solid white' : '6px solid transparent'
                                }}
                            >
                                <item.icon size={22} />
                                <span>{item.label}</span>
                            </button>
                        ))}
                    </div>

                    <div style={{ padding: '2rem' }}>
                        <button
                            onClick={onLogout}
                            style={{
                                width: '100%', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
                                background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '16px',
                                color: 'white', cursor: 'pointer', transition: 'all 0.3s', fontWeight: '700'
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.4)';
                                e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.5)'
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'
                            }}
                        >
                            <LogOut size={20} /> <span>Sign Out</span>
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="custom-scrollbar" style={{ flex: 1, overflowY: 'auto', scrollbarGutter: 'stable' }}>
                    <div className="container" style={{ maxWidth: '1400px', padding: '2.5rem' }}>
                        <header className="mb-8">
                            <h1 className="text-3xl font-bold mb-2" style={{
                                background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
                                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
                            }}>
                                {activeTab === 'dashboard' ? 'System Overview' : activeTab === 'employees' ? 'Staff Directory' : 'Leave Management'}
                            </h1>
                            <p className="text-muted">
                                {activeTab === 'dashboard' ? 'Real-time metrics & alerts' : activeTab === 'employees' ? 'Manage personnel & access details' : 'Process leave applications'}
                            </p>
                        </header>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="glass p-8 rounded-2xl min-h-[400px]"
                            >
                                {activeTab === 'dashboard' && (
                                    <div className="space-y-8">
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                            {[
                                                { label: 'Total Staff', val: stats.total, icon: Users, color: 'sky' },
                                                { label: 'Present Today', val: stats.active, icon: CheckCircle, color: 'emerald' },
                                                { label: 'On Leave', val: stats.onLeave, icon: Calendar, color: 'amber' },
                                                { label: 'Expected Returns', val: stats.pendingReturns, icon: Clock, color: 'amber' }
                                            ].map((s, i) => (
                                                <div key={i} className="glass p-6 rounded-2xl flex items-center gap-4 hover:scale-[1.02] transition-transform">
                                                    <div className={`w-16 h-16 rounded-full bg-${s.color}-100 flex items-center justify-center text-${s.color}-600`}>
                                                        <s.icon size={32} />
                                                    </div>
                                                    <div>
                                                        <p className="text-slate-500 font-semibold uppercase text-xs tracking-wider">{s.label}</p>
                                                        <h3 className="text-3xl font-bold text-slate-800">{s.val}</h3>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                            <div className="glass p-8 rounded-2xl">
                                                <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                                                    <Clock className="text-amber-500" /> Expected Returns
                                                </h3>
                                                {pendingReturns.length ? (
                                                    <div className="space-y-4">{pendingReturns.map(l => (
                                                        <div key={l.leave_id} className="flex justify-between p-4 bg-white rounded-xl border border-amber-100 shadow-sm">
                                                            <div>
                                                                <p className="font-bold">{l.employee_name}</p>
                                                                <p className="text-sm text-amber-600">Expected: {l.end_date}</p>
                                                            </div>
                                                            <span className="badge badge-pending">On Leave</span>
                                                        </div>
                                                    ))}</div>
                                                ) : <p className="text-slate-400 italic">No pending returns.</p>}
                                            </div>
                                            <div className="glass p-8 rounded-2xl">
                                                <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                                                    <Calendar className="text-amber-500" /> Currently On Leave
                                                </h3>
                                                {activeLeaves.length ? (
                                                    <div className="space-y-4">{activeLeaves.map(l => (
                                                        <div key={l.leave_id} className="flex justify-between p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                                                            <div>
                                                                <p className="font-bold">{l.employee_name}</p>
                                                                <p className="text-sm text-slate-500">Return: {l.end_date}</p>
                                                            </div>
                                                            <span className="badge badge-approved">Active</span>
                                                        </div>
                                                    ))}</div>
                                                ) : <p className="text-slate-400 italic">No employees currently on leave.</p>}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'employees' && (
                                    <div>
                                        <div className="flex justify-between items-center mb-8">
                                            <div className="relative">
                                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                                <input
                                                    type="text"
                                                    placeholder="Search staff..."
                                                    value={searchQuery}
                                                    onChange={e => setSearchQuery(e.target.value)}
                                                    className="pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-white w-[300px] outline-none shadow-sm focus:ring-2 focus:ring-sky-500"
                                                />
                                            </div>
                                            <button
                                                onClick={() => setShowAddModal(true)}
                                                className="btn btn-primary"
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.5rem',
                                                    padding: '0.75rem 1.5rem',
                                                    background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
                                                    border: 'none',
                                                    borderRadius: '12px',
                                                    color: 'white',
                                                    fontWeight: '700',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.3s',
                                                    boxShadow: '0 4px 15px rgba(14, 165, 233, 0.3)'
                                                }}
                                                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                                                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                                            >
                                                <Plus size={18} /> Add Employee
                                            </button>
                                        </div>
                                        <div className="table-container">
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th>Name</th>
                                                        <th>Position</th>
                                                        <th>Department</th>
                                                        <th>Status</th>
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {filteredEmployees.map(emp => (
                                                        <tr key={emp.id} className="hover:bg-slate-50/50">
                                                            <td className="font-medium text-slate-700">{emp.name}</td>
                                                            <td>{emp.position}</td>
                                                            <td>{emp.department}</td>
                                                            <td>
                                                                <span className={`badge ${emp.status === 'Active' ? 'badge-approved' : 'badge-pending'}`}>
                                                                    {emp.status}
                                                                </span>
                                                            </td>
                                                            <td>
                                                                <div className="flex gap-2">
                                                                    <button
                                                                        onClick={() => handleViewEmployee(emp)}
                                                                        style={{
                                                                            padding: '0.5rem',
                                                                            borderRadius: '8px',
                                                                            border: 'none',
                                                                            background: 'rgba(14, 165, 233, 0.1)',
                                                                            color: '#0ea5e9',
                                                                            cursor: 'pointer',
                                                                            transition: 'all 0.3s',
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            justifyContent: 'center'
                                                                        }}
                                                                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(14, 165, 233, 0.2)'}
                                                                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(14, 165, 233, 0.1)'}
                                                                        title="View Details"
                                                                    >
                                                                        <FileText size={18} />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleEditEmployee(emp)}
                                                                        style={{
                                                                            padding: '0.5rem',
                                                                            borderRadius: '8px',
                                                                            border: 'none',
                                                                            background: 'rgba(245, 158, 11, 0.1)',
                                                                            color: '#f59e0b',
                                                                            cursor: 'pointer',
                                                                            transition: 'all 0.3s',
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            justifyContent: 'center'
                                                                        }}
                                                                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(245, 158, 11, 0.2)'}
                                                                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(245, 158, 11, 0.1)'}
                                                                        title="Edit"
                                                                    >
                                                                        <Edit size={18} />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleDeleteEmployee(emp.id, emp.name)}
                                                                        style={{
                                                                            padding: '0.5rem',
                                                                            borderRadius: '8px',
                                                                            border: 'none',
                                                                            background: 'rgba(239, 68, 68, 0.1)',
                                                                            color: '#ef4444',
                                                                            cursor: 'pointer',
                                                                            transition: 'all 0.3s',
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            justifyContent: 'center'
                                                                        }}
                                                                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'}
                                                                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
                                                                        title="Delete"
                                                                    >
                                                                        <Trash2 size={18} />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'leaves' && (
                                    <div className="space-y-8">
                                        <div>
                                            <h3 className="text-xl font-bold mb-6 text-slate-800">Pending Requests</h3>
                                            <div className="table-container bg-white rounded-xl border border-slate-100">
                                                <table>
                                                    <thead>
                                                        <tr>
                                                            <th>Employee</th>
                                                            <th>Reason</th>
                                                            <th>Days</th>
                                                            <th>Applied</th>
                                                            <th>Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {filteredLeaves.filter(l => l.status === 'Pending').map(l => (
                                                            <tr key={l.leave_id}>
                                                                <td className="font-bold">{l.employee_name}</td>
                                                                <td>{l.reason}</td>
                                                                <td>{l.leave_days}</td>
                                                                <td>{l.applied_on}</td>
                                                                <td className="flex gap-2">
                                                                    <button
                                                                        onClick={() => updateLeaveStatus(l.leave_id, 'Approved')}
                                                                        style={{
                                                                            padding: '0.5rem',
                                                                            borderRadius: '8px',
                                                                            border: 'none',
                                                                            background: 'rgba(16, 185, 129, 0.1)',
                                                                            color: '#10b981',
                                                                            cursor: 'pointer',
                                                                            transition: 'all 0.3s'
                                                                        }}
                                                                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(16, 185, 129, 0.2)'}
                                                                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(16, 185, 129, 0.1)'}
                                                                        title="Approve"
                                                                    >
                                                                        <CheckCircle size={20} />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => updateLeaveStatus(l.leave_id, 'Rejected')}
                                                                        style={{
                                                                            padding: '0.5rem',
                                                                            borderRadius: '8px',
                                                                            border: 'none',
                                                                            background: 'rgba(239, 68, 68, 0.1)',
                                                                            color: '#ef4444',
                                                                            cursor: 'pointer',
                                                                            transition: 'all 0.3s'
                                                                        }}
                                                                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'}
                                                                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
                                                                        title="Reject"
                                                                    >
                                                                        <XCircle size={20} />
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                        {!filteredLeaves.some(l => l.status === 'Pending') && (
                                                            <tr>
                                                                <td colSpan={5} className="text-center text-slate-400 py-8">No pending requests</td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold mb-6 text-slate-800">Leave History</h3>
                                            <div className="table-container">
                                                <table>
                                                    <thead>
                                                        <tr>
                                                            <th>Employee</th>
                                                            <th>Range</th>
                                                            <th>Days</th>
                                                            <th>Status</th>
                                                            <th>Return Status</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {filteredLeaves.filter(l => l.status !== 'Pending').map(l => (
                                                            <tr key={l.leave_id}>
                                                                <td>{l.employee_name}</td>
                                                                <td className="text-sm">{l.start_date} → {l.end_date}</td>
                                                                <td>{l.leave_days}</td>
                                                                <td>
                                                                    <span className={`badge badge-${l.status.toLowerCase()}`}>{l.status}</span>
                                                                </td>
                                                                <td>
                                                                    {l.returned === 'Yes' ?
                                                                        <span className="text-emerald-600 font-semibold px-2">Returned</span> :
                                                                        <span className="text-amber-600 px-2">On Leave</span>
                                                                    }
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* View Modal */}
                <AnimatePresence>
                    {showViewModal && viewingEmployee && (
                        <div
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                            onClick={() => setShowViewModal(false)}
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden"
                                onClick={e => e.stopPropagation()}
                            >
                                <div className="bg-sky-500 p-8 text-white relative">
                                    <button
                                        onClick={() => setShowViewModal(false)}
                                        className="absolute top-4 right-4 text-white/70 hover:text-white"
                                    >
                                        <X size={24} />
                                    </button>
                                    <div className="flex items-center gap-6">
                                        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-sky-500 shadow-inner">
                                            <UserCircle size={64} />
                                        </div>
                                        <div>
                                            <h2 className="text-3xl font-bold">{viewingEmployee.name}</h2>
                                            <p className="opacity-90 text-lg">{viewingEmployee.position} • {viewingEmployee.department}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-8">
                                    <div className="grid grid-cols-2 gap-6 mb-8">
                                        <div>
                                            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Email</p>
                                            <p className="text-lg text-slate-700">{viewingEmployee.email}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Phone</p>
                                            <p className="text-lg text-slate-700">{viewingEmployee.phone}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Status</p>
                                            <p className="text-lg text-slate-700">{viewingEmployee.status}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">ID</p>
                                            <p className="text-lg text-slate-700">#{viewingEmployee.id}</p>
                                        </div>
                                    </div>
                                    <h3 className="font-bold text-slate-800 mb-4 border-b pb-2">Recent Leaves</h3>
                                    {viewingEmployee.leave_history?.length ? (
                                        <div className="space-y-3">
                                            {viewingEmployee.leave_history.slice(0, 3).map((lh: any) => (
                                                <div key={lh.leave_id} className="flex justify-between items-center text-sm p-3 bg-slate-50 rounded-lg">
                                                    <span>{lh.start_date} - {lh.end_date} ({lh.leave_days} d)</span>
                                                    <span className={`badge badge-${lh.status.toLowerCase()}`}>{lh.status}</span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : <p className="text-slate-400 italic">No leave history.</p>}
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Add/Edit Modal */}
                <AnimatePresence>
                    {(showAddModal || showEditModal) && (
                        <div
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                            onClick={() => {
                                setShowAddModal(false);
                                setShowEditModal(false);
                            }}
                        >
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.95, opacity: 0 }}
                                className="bg-white rounded-2xl w-full max-w-lg p-8 shadow-2xl"
                                onClick={e => e.stopPropagation()}
                            >
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold text-slate-800">
                                        {showAddModal ? 'Add Employee' : 'Edit Employee'}
                                    </h2>
                                    <button
                                        onClick={() => {
                                            setShowAddModal(false);
                                            setShowEditModal(false);
                                        }}
                                        className="p-2 hover:bg-slate-100 rounded-lg"
                                    >
                                        <X />
                                    </button>
                                </div>
                                <div className="space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
                                    {['name', 'position', 'department', 'email', 'phone'].map(field => (
                                        <div key={field}>
                                            <label className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1 block">
                                                {field}
                                            </label>
                                            <input
                                                className="input w-full"
                                                value={showAddModal ? newEmployee[field] : editingEmployee?.[field] || ''}
                                                onChange={e => {
                                                    const val = e.target.value;
                                                    if (showAddModal) {
                                                        setNewEmployee({ ...newEmployee, [field]: val });
                                                    } else {
                                                        setEditingEmployee({ ...editingEmployee, [field]: val });
                                                    }
                                                }}
                                            />
                                        </div>
                                    ))}
                                    <div>
                                        <label className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1 block">
                                            Status
                                        </label>
                                        <select
                                            className="input w-full"
                                            value={showAddModal ? newEmployee.status : editingEmployee?.status || 'Active'}
                                            onChange={e => {
                                                const val = e.target.value;
                                                if (showAddModal) {
                                                    setNewEmployee({ ...newEmployee, status: val });
                                                } else {
                                                    setEditingEmployee({ ...editingEmployee, status: val });
                                                }
                                            }}
                                        >
                                            <option value="Active">Active</option>
                                            <option value="Inactive">Inactive</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="mt-8 pt-4 border-t flex gap-4">
                                    <button
                                        className="flex-1 py-3 rounded-xl font-bold text-white transition-all"
                                        style={{
                                            background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
                                            boxShadow: '0 4px 15px rgba(14, 165, 233, 0.3)'
                                        }}
                                        onClick={showAddModal ? handleAddEmployee : handleSaveEmployee}
                                        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                                        onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                                    >
                                        Save
                                    </button>
                                    <button
                                        className="px-6 py-3 rounded-xl border font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                                        onClick={() => {
                                            setShowAddModal(false);
                                            setShowEditModal(false);
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default AdminDashboard;
