import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const getInitials = (name) => {
        return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
    };

    return (
        <header style={{
            position: 'sticky',
            top: 0,
            zIndex: 100,
            backgroundColor: 'var(--neutral-0)',
            borderBottom: '1px solid var(--neutral-200)',
            padding: '0 var(--spacing-6)',
            height: 'var(--header-height)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: 'var(--shadow-sm)'
        }}>
            {/* Logo and Brand */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
                <div style={{
                    width: '2.5rem',
                    height: '2.5rem',
                    backgroundColor: 'var(--primary-teal)',
                    borderRadius: 'var(--radius-lg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.25rem'
                }}>
                    🗺️
                </div>
                <h1 style={{ 
                    margin: 0, 
                    fontSize: 'var(--font-size-xl)',
                    fontWeight: 'var(--font-weight-bold)',
                    color: 'var(--neutral-900)',
                    background: 'linear-gradient(135deg, var(--primary-teal) 0%, var(--accent-coral) 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                }}>
                    Journey Tracker
                </h1>
            </div>
            
            {/* User Menu */}
            <div style={{ position: 'relative' }}>
                <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--spacing-3)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 'var(--spacing-2)',
                        borderRadius: 'var(--radius-lg)',
                        transition: 'background-color var(--transition-normal)'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--neutral-100)'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                    <div className="avatar avatar-md" style={{
                        backgroundColor: user?.role === 'Group Leader' ? 'var(--accent-coral)' : 'var(--primary-teal)',
                        color: 'white'
                    }}>
                        {getInitials(user?.username)}
                    </div>
                    <div style={{ textAlign: 'left' }}>
                        <div style={{ 
                            fontSize: 'var(--font-size-sm)', 
                            fontWeight: 'var(--font-weight-medium)',
                            color: 'var(--neutral-900)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--spacing-1)'
                        }}>
                            {user?.username}
                            <span style={{ fontSize: 'var(--font-size-base)' }}>
                                {user?.role === 'Group Leader' ? '👑' : '👤'}
                            </span>
                        </div>
                        <div style={{ 
                            fontSize: 'var(--font-size-xs)', 
                            color: 'var(--neutral-500)'
                        }}>
                            {user?.role}
                        </div>
                    </div>
                    <svg 
                        style={{ 
                            width: '1rem', 
                            height: '1rem', 
                            color: 'var(--neutral-500)',
                            transform: showDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform var(--transition-normal)'
                        }}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                {/* Dropdown Menu */}
                {showDropdown && (
                    <div style={{
                        position: 'absolute',
                        top: '100%',
                        right: 0,
                        marginTop: 'var(--spacing-2)',
                        backgroundColor: 'var(--neutral-0)',
                        borderRadius: 'var(--radius-xl)',
                        boxShadow: 'var(--shadow-lg)',
                        border: '1px solid var(--neutral-200)',
                        minWidth: '200px',
                        overflow: 'hidden',
                        zIndex: 200
                    }}>
                        <div style={{ padding: 'var(--spacing-3) var(--spacing-4)' }}>
                            <div style={{ 
                                fontSize: 'var(--font-size-sm)', 
                                fontWeight: 'var(--font-weight-medium)',
                                color: 'var(--neutral-900)',
                                marginBottom: 'var(--spacing-1)'
                            }}>
                                {user?.username}
                            </div>
                            <div style={{ 
                                fontSize: 'var(--font-size-xs)', 
                                color: 'var(--neutral-500)'
                            }}>
                                {user?.email || 'user@example.com'}
                            </div>
                        </div>
                        
                        <div style={{ borderTop: '1px solid var(--neutral-200)' }}>
                            <button
                                onClick={() => {
                                    setShowDropdown(false);
                                    // Add profile navigation here
                                }}
                                style={{
                                    width: '100%',
                                    textAlign: 'left',
                                    padding: 'var(--spacing-3) var(--spacing-4)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: 'var(--font-size-sm)',
                                    color: 'var(--neutral-700)',
                                    transition: 'background-color var(--transition-normal)'
                                }}
                                onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--neutral-50)'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                            >
                                👤 Profile Settings
                            </button>
                            
                            <button
                                onClick={() => {
                                    setShowDropdown(false);
                                    // Add help navigation here
                                }}
                                style={{
                                    width: '100%',
                                    textAlign: 'left',
                                    padding: 'var(--spacing-3) var(--spacing-4)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: 'var(--font-size-sm)',
                                    color: 'var(--neutral-700)',
                                    transition: 'background-color var(--transition-normal)'
                                }}
                                onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--neutral-50)'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                            >
                                ❓ Help & Documentation
                            </button>
                            
                            <div style={{ borderTop: '1px solid var(--neutral-200)', marginTop: 'var(--spacing-1)' }}>
                                <button
                                    onClick={() => {
                                        setShowDropdown(false);
                                        handleLogout();
                                    }}
                                    style={{
                                        width: '100%',
                                        textAlign: 'left',
                                        padding: 'var(--spacing-3) var(--spacing-4)',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontSize: 'var(--font-size-sm)',
                                        color: 'var(--accent-coral)',
                                        fontWeight: 'var(--font-weight-medium)',
                                        transition: 'background-color var(--transition-normal)'
                                    }}
                                    onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 107, 107, 0.1)'}
                                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                                >
                                    🚪 Sign Out
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Click outside to close dropdown */}
            {showDropdown && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 100
                    }}
                    onClick={() => setShowDropdown(false)}
                />
            )}
        </header>
    );
};

export default Header;
