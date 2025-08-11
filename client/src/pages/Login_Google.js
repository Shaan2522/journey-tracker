import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        try {
            const userData = await authService.login({ username, password });
            login(userData);
            navigate('/dashboard');
        } catch (error) {
            console.error('Login failed', error);
            setError(error.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#f8f9fa',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            fontFamily: 'var(--font-family-primary)'
        }}>
            {/* Google Style Login Card */}
            <div style={{
                width: '100%',
                maxWidth: '448px',
                backgroundColor: '#ffffff',
                borderRadius: '8px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                border: '1px solid #dadce0',
                padding: '48px 40px 36px 40px'
            }}>
                {/* Google Logo Area */}
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{
                        width: '48px',
                        height: '48px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 16px'
                    }}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#EA4335"/>
                            <path d="M12 8c0.55 0 1 0.45 1 1s-0.45 1-1 1-1-0.45-1-1 0.45-1 1-1z" fill="#ffffff"/>
                        </svg>
                    </div>
                    <h1 style={{
                        fontSize: '24px',
                        fontWeight: '400',
                        color: '#3c4043',
                        marginBottom: '8px',
                        fontFamily: 'var(--font-family-primary)'
                    }}>
                        Sign in
                    </h1>
                    <p style={{
                        fontSize: '16px',
                        color: '#5f6368',
                        marginBottom: '0',
                        fontFamily: 'var(--font-family-secondary)'
                    }}>
                        to continue to Journey Tracker
                    </p>
                </div>
                
                {/* Google Material Error Alert */}
                {error && (
                    <div style={{
                        backgroundColor: '#fce8e6',
                        border: '1px solid #f28b82',
                        borderRadius: '4px',
                        padding: '16px',
                        marginBottom: '24px',
                        color: '#d93025',
                        fontSize: '14px',
                        fontFamily: 'var(--font-family-secondary)'
                    }}>
                        <div style={{ fontWeight: '500', marginBottom: '4px' }}>
                            Sign in failed
                        </div>
                        <div>{error}</div>
                    </div>
                )}

                {/* Google Material Form */}
                <form onSubmit={handleSubmit}>
                    {/* Username Field */}
                    <div style={{ marginBottom: '24px' }}>
                        <div style={{
                            position: 'relative',
                            border: '1px solid #dadce0',
                            borderRadius: '4px',
                            padding: '12px 16px',
                            fontSize: '16px',
                            fontFamily: 'var(--font-family-secondary)',
                            transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out'
                        }}>
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                placeholder="Username"
                                style={{
                                    width: '100%',
                                    border: 'none',
                                    outline: 'none',
                                    fontSize: '16px',
                                    fontFamily: 'var(--font-family-secondary)',
                                    color: '#3c4043',
                                    backgroundColor: 'transparent'
                                }}
                                onFocus={(e) => {
                                    e.target.parentElement.style.borderColor = '#1a73e8';
                                    e.target.parentElement.style.boxShadow = '0 0 0 1px #1a73e8';
                                }}
                                onBlur={(e) => {
                                    e.target.parentElement.style.borderColor = '#dadce0';
                                    e.target.parentElement.style.boxShadow = 'none';
                                }}
                            />
                        </div>
                    </div>
                    
                    {/* Password Field */}
                    <div style={{ marginBottom: '32px' }}>
                        <div style={{
                            position: 'relative',
                            border: '1px solid #dadce0',
                            borderRadius: '4px',
                            padding: '12px 16px',
                            fontSize: '16px',
                            fontFamily: 'var(--font-family-secondary)',
                            transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out'
                        }}>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="Password"
                                style={{
                                    width: '100%',
                                    border: 'none',
                                    outline: 'none',
                                    fontSize: '16px',
                                    fontFamily: 'var(--font-family-secondary)',
                                    color: '#3c4043',
                                    backgroundColor: 'transparent'
                                }}
                                onFocus={(e) => {
                                    e.target.parentElement.style.borderColor = '#1a73e8';
                                    e.target.parentElement.style.boxShadow = '0 0 0 1px #1a73e8';
                                }}
                                onBlur={(e) => {
                                    e.target.parentElement.style.borderColor = '#dadce0';
                                    e.target.parentElement.style.boxShadow = 'none';
                                }}
                            />
                        </div>
                    </div>
                    
                    {/* Action Buttons - Google Style */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '16px',
                        flexWrap: 'wrap'
                    }}>
                        <Link 
                            to="/signup"
                            style={{
                                color: '#1a73e8',
                                textDecoration: 'none',
                                fontSize: '14px',
                                fontWeight: '500',
                                padding: '8px',
                                borderRadius: '4px',
                                transition: 'background-color var(--transition-standard)',
                                fontFamily: 'var(--font-family-primary)'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = 'rgba(26, 115, 232, 0.04)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = 'transparent';
                            }}
                        >
                            Create account
                        </Link>
                        
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                backgroundColor: loading ? '#f8f9fa' : '#1a73e8',
                                color: loading ? '#5f6368' : 'white',
                                border: 'none',
                                borderRadius: '4px',
                                padding: '10px 24px',
                                fontSize: '14px',
                                fontWeight: '500',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                transition: 'all var(--transition-standard)',
                                fontFamily: 'var(--font-family-primary)',
                                textTransform: 'none',
                                boxShadow: loading ? 'none' : 'var(--elevation-2)'
                            }}
                            onMouseEnter={(e) => {
                                if (!loading) {
                                    e.target.style.backgroundColor = '#1557b0';
                                    e.target.style.boxShadow = 'var(--elevation-4)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!loading) {
                                    e.target.style.backgroundColor = '#1a73e8';
                                    e.target.style.boxShadow = 'var(--elevation-2)';
                                }
                            }}
                        >
                            {loading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </div>
                </form>
                
                {/* Bottom Links */}
                <div style={{
                    marginTop: '32px',
                    paddingTop: '24px',
                    borderTop: '1px solid #e8eaed',
                    textAlign: 'center'
                }}>
                    <Link 
                        to="/"
                        style={{
                            color: '#5f6368',
                            textDecoration: 'none',
                            fontSize: '14px',
                            fontFamily: 'var(--font-family-secondary)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '8px',
                            borderRadius: '4px',
                            transition: 'color var(--transition-standard)'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.color = '#1a73e8';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.color = '#5f6368';
                        }}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
                        </svg>
                        Back to homepage
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
