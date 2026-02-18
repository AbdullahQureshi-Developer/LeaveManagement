import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LogOut, User, Send, History, CheckCircle2, UserCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = 'http://localhost:5000/api';

interface EmployeeDashboardProps {
    user: { token: string; username: string };
    onLogout: () => void;
}

const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({ user, onLogout }) => {
    const [profile, setProfile] = useState<any>(null);
    const [leaves, setLeaves] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'profile' | 'apply' | 'history'>('profile');

    // Form state
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [reason, setReason] = useState('');
    const [actionLoading, setActionLoading] = useState(false);
    const [msg, setMsg] = useState('');

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const headers = { Authorization: `Bearer ${user.token}` };
            if (activeTab === 'profile') {
                const res = await axios.get(`${API_URL}/employee/profile`, { headers });
                setProfile(res.data);
            } else if (activeTab === 'history') {
                const res = await axios.get(`${API_URL}/employee/leaves`, { headers });
                setLeaves(res.data);
            }
        } catch (err) {
            console.error('Error fetching employee data', err);
        } finally {
            setLoading(false);
        }
    };

    const handleApply = async (e: React.FormEvent) => {
        e.preventDefault();
        setActionLoading(true);
        setMsg('');
        try {
            const start = new Date(startDate);
            const end = new Date(endDate);
            const diffTime = Math.abs(end.getTime() - start.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

            const headers = { Authorization: `Bearer ${user.token}` };
            const res = await axios.post(`${API_URL}/employee/leaves`, {
                start_date: startDate,
                end_date: endDate,
                leave_days: diffDays,
                reason
            }, { headers });

            setMsg(res.data.message);
            setStartDate('');
            setEndDate('');
            setReason('');
            fetchData();
        } catch (err: any) {
            setMsg(err.response?.data?.message || 'Failed to apply');
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <div className="h-screen flex items-center justify-center relative overflow-hidden" style={{
            background: '#0ea5e9',
            fontFamily: "'Outfit', sans-serif"
        }}>
            {/* Full Screen Background Image with Shaded Overlay */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: 'url("/image/university.png")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                zIndex: 0
            }} />
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.6) 0%, rgba(15, 23, 42, 0.8) 100%)',
                zIndex: 1
            }} />

            {/* Main Floating Dashboard Container */}
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                style={{
                    position: 'relative',
                    zIndex: 2,
                    width: '96vw',
                    height: '92vh',
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '40px',
                    boxShadow: '0 50px 100px rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    overflow: 'hidden',
                    border: '1px solid rgba(255, 255, 255, 0.3)'
                }}
            >
                {/* Shaded Institutional Sidebar */}
                <div style={{
                    width: '300px',
                    background: 'linear-gradient(180deg, rgba(14, 165, 233, 0.95) 0%, rgba(2, 132, 199, 1) 100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '10px 0 30px rgba(0, 0, 0, 0.1)',
                    position: 'relative',
                    zIndex: 10,
                    borderRight: '1px solid rgba(255, 255, 255, 0.1)',
                    overflowY: 'auto'
                }}>
                    <div style={{
                        padding: '3rem 2rem',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                    }}>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center',
                            gap: '1.25rem'
                        }}>
                            <div style={{
                                width: '80px',
                                height: '80px',
                                borderRadius: '24px',
                                background: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 15px 35px rgba(0, 0, 0, 0.2)'
                            }}>
                                <UserCircle size={48} color="#0ea5e9" />
                            </div>
                            <div>
                                <h3 style={{ color: 'white', fontWeight: '800', fontSize: '1.25rem', marginBottom: '0.25rem' }}>
                                    {profile?.name || user.username}
                                </h3>
                                <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.875rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    Staff Portal
                                </p>
                            </div>
                        </div>
                    </div>

                    <div style={{ flex: 1, padding: '2rem 0' }}>
                        <div style={{ padding: '0 2rem', marginBottom: '1rem' }}>
                            <span style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                Service Menu
                            </span>
                        </div>

                        <button
                            onClick={() => setActiveTab('profile')}
                            style={{
                                width: '100%',
                                padding: '1rem 2rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                background: activeTab === 'profile' ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                                border: 'none',
                                color: 'white',
                                cursor: 'pointer',
                                transition: 'all 0.3s',
                                fontWeight: '700',
                                fontSize: '1rem',
                                borderLeft: activeTab === 'profile' ? '6px solid white' : '6px solid transparent'
                            }}
                        >
                            <User size={22} />
                            <span>My Profile</span>
                        </button>

                        <button
                            onClick={() => setActiveTab('apply')}
                            style={{
                                width: '100%',
                                padding: '1rem 2rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                background: activeTab === 'apply' ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                                border: 'none',
                                color: 'white',
                                cursor: 'pointer',
                                transition: 'all 0.3s',
                                fontWeight: '700',
                                fontSize: '1rem',
                                borderLeft: activeTab === 'apply' ? '6px solid white' : '6px solid transparent'
                            }}
                        >
                            <Send size={22} />
                            <span>Apply for Leave</span>
                        </button>

                        <button
                            onClick={() => setActiveTab('history')}
                            style={{
                                width: '100%',
                                padding: '1rem 2rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                background: activeTab === 'history' ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                                border: 'none',
                                color: 'white',
                                cursor: 'pointer',
                                transition: 'all 0.3s',
                                fontWeight: '700',
                                fontSize: '1rem',
                                borderLeft: activeTab === 'history' ? '6px solid white' : '6px solid transparent'
                            }}
                        >
                            <History size={22} />
                            <span>Request History</span>
                        </button>
                    </div>

                    <div style={{ padding: '2rem' }}>
                        <button
                            onClick={onLogout}
                            style={{
                                width: '100%',
                                padding: '1rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.75rem',
                                background: 'rgba(255, 255, 255, 0.1)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                borderRadius: '16px',
                                color: 'white',
                                cursor: 'pointer',
                                transition: 'all 0.3s',
                                fontWeight: '700'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.4)';
                                e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.5)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                            }}
                        >
                            <LogOut size={20} />
                            <span>Sign Out</span>
                        </button>
                    </div>
                </div>

                {/* Main Content Area */}
                <div
                    className="custom-scrollbar"
                    style={{
                        flex: 1,
                        overflowY: 'auto',
                        scrollbarGutter: 'stable'
                    }}
                >
                    <div className="container" style={{ maxWidth: '1400px', padding: '2.5rem' }}>
                        {/* Header */}
                        <header className="mb-8">
                            <h1 className="text-3xl font-bold mb-2" style={{
                                background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text'
                            }}>
                                {activeTab === 'profile' ? 'My Profile' : activeTab === 'apply' ? 'Apply for Leave' : 'Leave History'}
                            </h1>
                            <p className="text-muted">
                                {activeTab === 'profile'
                                    ? 'View your personal information and leave balance'
                                    : activeTab === 'apply'
                                        ? 'Submit a new leave request'
                                        : 'View your leave application history and status'}
                            </p>
                        </header>

                        {/* Content */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="glass p-8 rounded-2xl min-h-[400px]"
                            >
                                {loading && activeTab !== 'apply' ? (
                                    <div className="flex items-center justify-center h-full text-muted">Loading...</div>
                                ) : activeTab === 'profile' ? (
                                    <div className="flex flex-col md:flex-row gap-8">
                                        <div className="flex-1 space-y-4">
                                            <h3 className="text-2xl font-bold mb-6">Personal Information</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <p className="text-muted text-sm">Full Name</p>
                                                    <p className="text-lg font-medium">{profile?.name}</p>
                                                </div>
                                                <div>
                                                    <p className="text-muted text-sm">Position</p>
                                                    <p className="text-lg font-medium">{profile?.position}</p>
                                                </div>
                                                <div>
                                                    <p className="text-muted text-sm">Department</p>
                                                    <p className="text-lg font-medium">{profile?.department}</p>
                                                </div>
                                                <div>
                                                    <p className="text-muted text-sm">Email</p>
                                                    <p className="text-lg font-medium">{profile?.email}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w-full md:w-64 glass p-6 rounded-xl border-primary/20 flex flex-col items-center justify-center gap-4 text-center">
                                            <div className="text-4xl font-bold text-primary">{profile?.leave_balance}</div>
                                            <p className="text-sm text-muted">Days Leave Balance Remaining</p>
                                            <div className="w-full h-2 bg-glass-glow rounded-full overflow-hidden">
                                                <div className="h-full bg-primary" style={{ width: `${(profile?.leave_balance / 20) * 100}%` }}></div>
                                            </div>
                                        </div>
                                    </div>
                                ) : activeTab === 'apply' ? (
                                    <div className="max-w-2xl mx-auto">
                                        <h3 className="text-2xl font-bold mb-6 text-center">New Leave Application</h3>
                                        <form onSubmit={handleApply} className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="flex flex-col gap-1">
                                                    <label className="text-sm text-muted">Start Date</label>
                                                    <input type="date" className="input" value={startDate} onChange={e => setStartDate(e.target.value)} required />
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <label className="text-sm text-muted">End Date</label>
                                                    <input type="date" className="input" value={endDate} onChange={e => setEndDate(e.target.value)} required />
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <label className="text-sm text-muted">Reason for Leave</label>
                                                <textarea className="input" rows={4} value={reason} onChange={e => setReason(e.target.value)} placeholder="Explain briefly..." required></textarea>
                                            </div>
                                            {msg && (
                                                <div className={`p-4 rounded-lg flex items-center gap-2 ${msg.includes('success') ? 'bg-success/10 text-success border border-success/20' : 'bg-danger/10 text-danger border border-danger/20'}`}>
                                                    {msg.includes('success') ? <CheckCircle2 size={18} /> : null}
                                                    <span>{msg}</span>
                                                </div>
                                            )}
                                            <button type="submit" disabled={actionLoading} className="btn btn-primary w-full py-4 text-lg">
                                                {actionLoading ? 'Submitting...' : 'Submit Application'}
                                            </button>
                                        </form>
                                    </div>
                                ) : (
                                    <div className="table-container">
                                        <h3 className="text-2xl font-bold mb-6">Leave History</h3>
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Start Date</th>
                                                    <th>End Date</th>
                                                    <th>Days</th>
                                                    <th>Status</th>
                                                    <th>Reason</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {leaves.map((leave) => (
                                                    <tr key={leave.leave_id}>
                                                        <td>{leave.start_date}</td>
                                                        <td>{leave.end_date}</td>
                                                        <td>{leave.leave_days}</td>
                                                        <td>
                                                            <span className={`badge badge-${leave.status.toLowerCase()}`}>
                                                                {leave.status}
                                                            </span>
                                                        </td>
                                                        <td className="text-muted italic">{leave.reason}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default EmployeeDashboard;
