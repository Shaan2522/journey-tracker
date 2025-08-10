import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';

const Signup = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('Group Member');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        setLoading(true);
        
        try {
            const userData = await authService.signup({ username, password, role });
            login(userData);
            navigate('/dashboard');
        } catch (error) {
            console.error('Signup failed', error);
            setError(error.response?.data?.message || 'Signup failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '40px',
                borderRadius: '15px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                width: '100%',
                maxWidth: '400px'
            }}>
                <h2 style={{ 
                    textAlign: 'center', 
                    marginBottom: '30px',
                    color: '#333',
                    fontSize: '2rem'
                }}>
                    Join Journey Tracker!
                </h2>
                
                {error && (
                    <div style={{
                        backgroundColor: '#fee',
                        color: '#c33',
                        padding: '10px',
                        borderRadius: '5px',
                        marginBottom: '20px',
                        border: '1px solid #fcc'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ 
                            display: 'block', 
                            marginBottom: '5px', 
                            fontWeight: 'bold',
                            color: '#555'
                        }}>
                            Username
                        </label>
                        <input
                            type="text"
                            placeholder="Choose a username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '2px solid #ddd',
                                borderRadius: '8px',
                                fontSize: '16px',
                                boxSizing: 'border-box',
                                transition: 'border-color 0.3s'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#667eea'}
                            onBlur={(e) => e.target.style.borderColor = '#ddd'}
                        />
                    </div>
                    
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ 
                            display: 'block', 
                            marginBottom: '5px', 
                            fontWeight: 'bold',
                            color: '#555'
                        }}>
                            Password
                        </label>
                        <input
                            type="password"
                            placeholder="Create a password (min 6 characters)"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '2px solid #ddd',
                                borderRadius: '8px',
                                fontSize: '16px',
                                boxSizing: 'border-box',
                                transition: 'border-color 0.3s'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#667eea'}
                            onBlur={(e) => e.target.style.borderColor = '#ddd'}
                        />
                    </div>
                    
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ 
                            display: 'block', 
                            marginBottom: '5px', 
                            fontWeight: 'bold',
                            color: '#555'
                        }}>
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '2px solid #ddd',
                                borderRadius: '8px',
                                fontSize: '16px',
                                boxSizing: 'border-box',
                                transition: 'border-color 0.3s'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#667eea'}
                            onBlur={(e) => e.target.style.borderColor = '#ddd'}
                        />
                    </div>
                    
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ 
                            display: 'block', 
                            marginBottom: '5px', 
                            fontWeight: 'bold',
                            color: '#555'
                        }}>
                            I want to be a:
                        </label>
                        <select 
                            value={role} 
                            onChange={(e) => setRole(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '2px solid #ddd',
                                borderRadius: '8px',
                                fontSize: '16px',
                                boxSizing: 'border-box',
                                backgroundColor: 'white'
                            }}
                        >
                            <option value="Group Member">Group Member 👤</option>
                            <option value="Group Leader">Group Leader 👑</option>
                        </select>
                        <small style={{ color: '#666', fontSize: '12px' }}>
                            Leaders can create journeys, members can join them
                        </small>
                    </div>
                    
                    <button 
                        type="submit" 
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '15px',
                            backgroundColor: loading ? '#ccc' : '#ff6b6b',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            transition: 'background-color 0.3s'
                        }}
                    >
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>
                
                <div style={{ 
                    textAlign: 'center', 
                    marginTop: '20px',
                    color: '#666'
                }}>
                    Already have an account?{' '}
                    <Link 
                        to="/login" 
                        style={{ 
                            color: '#667eea', 
                            textDecoration: 'none',
                            fontWeight: 'bold'
                        }}
                    >
                        Sign in here
                    </Link>
                </div>
                
                <div style={{ 
                    textAlign: 'center', 
                    marginTop: '15px'
                }}>
                    <Link 
                        to="/" 
                        style={{ 
                            color: '#999', 
                            textDecoration: 'none',
                            fontSize: '14px'
                        }}
                    >
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Signup;
