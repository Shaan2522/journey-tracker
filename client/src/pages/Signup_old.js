import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';

const Signup = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
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
            const userData = await authService.signup({ username, password });
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
            background: 'linear-gradient(135deg, var(--primary-600) 0%, var(--accent-coral) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'var(--spacing-4)'
        }}>
            <div className="card" style={{
                width: '100%',
                maxWidth: '400px',
                animation: 'slideUp 0.5s ease-out'
            }}>
                <div className="card-header" style={{ textAlign: 'center', paddingBottom: 'var(--spacing-8)' }}>
                    <div style={{
                        width: '4rem',
                        height: '4rem',
                        backgroundColor: 'var(--accent-coral)',
                        borderRadius: 'var(--radius-xl)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2rem',
                        margin: '0 auto var(--spacing-4) auto'
                    }}>
                        🚀
                    </div>
                    <h1 className="heading-xl" style={{ marginBottom: 'var(--spacing-2)' }}>
                        Join Journey Tracker!
                    </h1>
                    <p className="text-neutral-600">
                        Create your account to start tracking journeys
                    </p>
                </div>
                
                {error && (
                    <div className="alert alert-error" style={{ marginBottom: 'var(--spacing-6)' }}>
                        <div className="alert-title">Signup Failed</div>
                        <div className="alert-description">{error}</div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="card-content">
                    <div style={{ marginBottom: 'var(--spacing-5)' }}>
                        <label className="form-label" htmlFor="signup-username">
                            Username
                        </label>
                        <input
                            id="signup-username"
                            type="text"
                            className="form-input"
                            placeholder="Choose a username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div style={{ marginBottom: 'var(--spacing-5)' }}>
                        <label className="form-label" htmlFor="signup-password">
                            Password
                        </label>
                        <input
                            id="signup-password"
                            type="password"
                            className="form-input"
                            placeholder="Create a password (min 6 characters)"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div style={{ marginBottom: 'var(--spacing-5)' }}>
                        <label className="form-label" htmlFor="confirm-password">
                            Confirm Password
                        </label>
                        <input
                            id="confirm-password"
                            type="password"
                            className="form-input"
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        className={`btn ${loading ? 'btn-disabled' : 'btn-accent'} btn-lg`}
                        disabled={loading}
                        style={{ 
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 'var(--spacing-2)'
                        }}
                    >
                        {loading && (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ animation: 'spin 1s linear infinite' }}>
                                <path d="M12 2V6M12 18V22M6 12H2M22 12H18M19.07 19.07L16.24 16.24M19.07 4.93L16.24 7.76M4.93 19.07L7.76 16.24M4.93 4.93L7.76 7.76" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                        )}
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>
                
                <div className="card-footer" style={{ textAlign: 'center', paddingTop: 'var(--spacing-6)' }}>
                    <p className="text-neutral-600" style={{ marginBottom: 'var(--spacing-3)' }}>
                        Already have an account?{' '}
                        <Link 
                            to="/login" 
                            style={{ 
                                color: 'var(--primary-teal)', 
                                textDecoration: 'none',
                                fontWeight: 'var(--font-weight-semibold)',
                                transition: 'color var(--transition-normal)'
                            }}
                            onMouseEnter={(e) => e.target.style.color = 'var(--primary-700)'}
                            onMouseLeave={(e) => e.target.style.color = 'var(--primary-teal)'}
                        >
                            Sign in here
                        </Link>
                    </p>
                    
                    <Link 
                        to="/" 
                        className="text-neutral-500"
                        style={{ 
                            textDecoration: 'none',
                            fontSize: 'var(--font-size-sm)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 'var(--spacing-1)',
                            transition: 'color var(--transition-normal)'
                        }}
                        onMouseEnter={(e) => e.target.style.color = 'var(--neutral-700)'}
                        onMouseLeave={(e) => e.target.style.color = 'var(--neutral-500)'}
                    >
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Signup;
