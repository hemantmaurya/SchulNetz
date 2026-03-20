import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

// Login Page
function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage('');

        try {
            const res = await axios.post('http://localhost:4000/api/auth/login', {
                email,
                password,
            });

            const { token, user } = res.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            setMessage('Login successful! Redirecting...');

            // Use navigate instead of window.location.href (better)
            if (user.role === 'admin') {
                window.location.href = '/admin';
            } else {
                window.location.href = '/dashboard';
            }
        } catch (err) {
            setMessage(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f0f4f8',
            padding: '20px',
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '40px',
                borderRadius: '12px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                width: '100%',
                maxWidth: '400px',
            }}>
                <h1 style={{
                    textAlign: 'center',
                    marginBottom: '30px',
                    color: '#1a202c',
                }}>
                    SchulNetz Login
                </h1>

                {message && (
                    <p style={{
                        textAlign: 'center',
                        color: message.includes('successful') ? 'green' : 'red',
                        marginBottom: '20px',
                    }}>
                        {message}
                    </p>
                )}

                <form onSubmit={handleLogin}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', color: '#4a5568' }}>
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '1px solid #e2e8f0',
                                borderRadius: '6px',
                                fontSize: '16px',
                            }}
                            placeholder="admin@schulnetz.local"
                            required
                        />
                    </div>

                    <div style={{ marginBottom: '30px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', color: '#4a5568' }}>
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '1px solid #e2e8f0',
                                borderRadius: '6px',
                                fontSize: '16px',
                            }}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        style={{
                            width: '100%',
                            padding: '14px',
                            backgroundColor: '#3182ce',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '16px',
                            cursor: 'pointer',
                        }}
                    >
                        Sign In
                    </button>
                </form>

            </div>
        </div>
    );
}

// Admin Dashboard (different page)
function AdminDashboard() {
    return (
        <div style={{ padding: '40px', backgroundColor: '#f0f4f8', minHeight: '100vh' }}>
            <h1 style={{ color: '#2d3748' }}>Welcome to Admin Dashboard</h1>
            <p>You are logged in as Admin. You can manage users, roles, etc. here.</p>
        </div>
    );
}

// General Dashboard (for other roles)
function GeneralDashboard() {
    return (
        <div style={{ padding: '40px', backgroundColor: '#f0f4f8', minHeight: '100vh' }}>
            <h1 style={{ color: '#2d3748' }}>Welcome to Dashboard</h1>
            <p>You are logged in. This is your main dashboard.</p>
        </div>
    );
}

// Main App with Routing
function MainApp() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/dashboard" element={<GeneralDashboard />} />
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </Router>
    );
}

export default MainApp;