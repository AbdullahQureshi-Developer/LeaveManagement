import React, { useState } from 'react';
import axios from 'axios';
import { AlertCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const API_URL = 'http://localhost:5000/api';

interface LoginPageProps {
    onLogin: (userData: any) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await axios.post(`${API_URL}/login`, { username, password });
            onLogin(response.data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed. Please check credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen flex items-center justify-center relative overflow-hidden" style={{
            background: '#0ea5e9',
            fontFamily: "'Outfit', sans-serif"
        }}>
            {/* Full Screen Background Image with Overlay */}
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

            {/* Sophisticated Gradient Overlay for Weight - Reduced Opacity for Clarity */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.4) 0%, rgba(6, 182, 212, 0.5) 100%)',
                zIndex: 1
            }} />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                style={{
                    position: 'relative',
                    zIndex: 2,
                    width: '100%',
                    maxWidth: '900px',
                    display: 'flex',
                    minHeight: '600px',
                    borderRadius: '32px',
                    overflow: 'hidden',
                    boxShadow: '0 40px 100px rgba(0, 0, 0, 0.4)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(20px)'
                }}
            >
                {/* Left Side: Branding / Institutional Info */}
                <div style={{
                    flex: 1,
                    padding: '4rem 3rem',
                    background: 'rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    borderRight: '1px solid rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)'
                }}>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <h1 style={{
                            fontSize: '4.5rem',
                            fontWeight: '900',
                            color: 'white',
                            lineHeight: '1',
                            marginBottom: '1.5rem',
                            letterSpacing: '-0.04em',
                            textTransform: 'uppercase'
                        }}>
                            University
                        </h1>
                        <div style={{
                            width: '80px',
                            height: '6px',
                            background: 'white',
                            borderRadius: '3px',
                            marginBottom: '2rem'
                        }} />
                        <p style={{
                            color: 'rgba(255, 255, 255, 0.9)',
                            fontSize: '1.25rem',
                            lineHeight: '1.6',
                            maxWidth: '300px',
                            fontWeight: '500'
                        }}>
                            Leave Management & Administrative Services.
                        </p>
                    </motion.div>
                </div>

                {/* Right Side: Login Form */}
                <div style={{
                    flex: 1.2,
                    padding: '4rem 3.5rem',
                    background: 'rgba(255, 255, 255, 0.98)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                }}>
                    <div className="mb-8">
                        <h2 style={{
                            fontSize: '1.75rem',
                            fontWeight: '700',
                            color: '#1e293b',
                            marginBottom: '0.5rem'
                        }}>Staff Login</h2>
                        <p style={{ color: '#64748b' }}>Please enter your administrative credentials.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex flex-col gap-2">
                            <label style={{
                                fontSize: '0.875rem',
                                fontWeight: '700',
                                color: '#475569',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em'
                            }}>Official Username</label>
                            <input
                                type="text"
                                className="input"
                                placeholder="e.g. j.smith@university.edu"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                style={{
                                    padding: '1rem 1.25rem',
                                    borderRadius: '16px',
                                    border: '2px solid #e2e8f0',
                                    fontSize: '1rem'
                                }}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-center">
                                <label style={{
                                    fontSize: '0.875rem',
                                    fontWeight: '700',
                                    color: '#475569',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em'
                                }}>Secure Password</label>
                            </div>
                            <input
                                type="password"
                                className="input"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                style={{
                                    padding: '1rem 1.25rem',
                                    borderRadius: '16px',
                                    border: '2px solid #e2e8f0',
                                    fontSize: '1rem'
                                }}
                            />
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                style={{
                                    padding: '1rem',
                                    background: 'rgba(239, 68, 68, 0.05)',
                                    border: '1px solid rgba(239, 68, 68, 0.2)',
                                    borderRadius: '12px',
                                    color: '#dc2626',
                                    fontSize: '0.875rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem'
                                }}
                            >
                                <AlertCircle size={18} />
                                <span>{error}</span>
                            </motion.div>
                        )}

                        <button
                            type="submit"
                            className="w-full"
                            disabled={loading}
                            style={{
                                marginTop: '2rem', // Move the button lower
                                padding: '1.125rem',
                                fontSize: '1.125rem',
                                fontWeight: '700',
                                background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '16px',
                                cursor: 'pointer',
                                transition: 'all 0.3s',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.75rem',
                                boxShadow: '0 10px 25px rgba(14, 165, 233, 0.3)'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 15px 35px rgba(14, 165, 233, 0.4)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'none';
                                e.currentTarget.style.boxShadow = '0 10px 25px rgba(14, 165, 233, 0.3)';
                            }}
                        >
                            {loading ? (
                                'Authenticating...'
                            ) : (
                                <>
                                    Login to Portal
                                    <ArrowRight size={20} />
                                </>
                            )}
                        </button>
                    </form>

                    <div style={{ marginTop: 'auto', paddingTop: '2rem', borderTop: '1px solid #f1f5f9', textAlign: 'center' }}>
                        <p style={{ color: '#94a3b8', fontSize: '0.8125rem' }}>
                            Official University System • Secure Administrative Access Only
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;
