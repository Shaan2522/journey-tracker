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
            zIndex: 1000,
            backgroundColor: '#ffffff',
            borderBottom: '1px solid var(--google-gray-200)',
            padding: '0 24px',
            height: '64px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            fontFamily: 'var(--font-family-primary)'
        }}>
            {/* Google Maps Style Logo */}
            <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 'var(--spacing-3)',
                cursor: 'pointer'
            }}
            onClick={() => navigate('/')}
            >
                {/* Google Maps Icon */}
                <div style={{
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px'
                }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#EA4335"/>
                        <path d="M12 8c0.55 0 1 0.45 1 1s-0.45 1-1 1-1-0.45-1-1 0.45-1 1-1z" fill="#ffffff"/>
                    </svg>
                </div>
                
                <h1 style={{ 
                    margin: 0, 
                    fontSize: '22px',
                    fontWeight: '400',
                    color: '#5f6368',
                    fontFamily: 'var(--font-family-primary)',
                    letterSpacing: '0'
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
                        gap: 'var(--spacing-2)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '8px',
                        borderRadius: '50%',
                        transition: 'background-color var(--transition-standard)'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(60, 64, 67, 0.08)'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                    {/* Google Style Avatar */}
                    <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: user?.role === 'Group Leader' ? '#EA4335' : '#1A73E8',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px',
                        fontWeight: '500',
                        fontFamily: 'var(--font-family-primary)',
                        border: '2px solid #ffffff',
                        boxShadow: '0 1px 3px rgba(60, 64, 67, 0.3)'
                    }}>
                        {getInitials(user?.username)}
                    </div>
                </button>

                {/* Google Material Dropdown */}
                {showDropdown && (
                    <div style={{
                        position: 'absolute',
                        top: '100%',
                        right: 0,
                        marginTop: '8px',
                        backgroundColor: '#ffffff',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.08)',
                        minWidth: '320px',
                        overflow: 'hidden',
                        zIndex: 1001,
                        fontFamily: 'var(--font-family-primary)'
                    }}>
                        {/* User Info Section - Google Style */}
                        <div style={{ 
                            padding: '20px',
                            borderBottom: '1px solid var(--google-gray-200)',
                            textAlign: 'center'
                        }}>
                            <div style={{
                                width: '60px',
                                height: '60px',
                                borderRadius: '50%',
                                backgroundColor: user?.role === 'Group Leader' ? '#EA4335' : '#1A73E8',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '24px',
                                fontWeight: '500',
                                margin: '0 auto var(--spacing-3)',
                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                            }}>
                                {getInitials(user?.username)}
                            </div>
                            <div style={{ 
                                fontSize: '16px', 
                                fontWeight: '500',
                                color: 'var(--google-maps-text-primary)',
                                marginBottom: 'var(--spacing-1)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 'var(--spacing-2)'
                            }}>
                                {user?.username}
                                <span style={{ fontSize: '16px' }}>
                                    {user?.role === 'Group Leader' ? '👑' : '👤'}
                                </span>
                            </div>
                            <div style={{ 
                                fontSize: '14px', 
                                color: 'var(--google-maps-text-secondary)',
                                marginBottom: 'var(--spacing-1)'
                            }}>
                                {user?.email || 'user@example.com'}
                            </div>
                            <div style={{ 
                                fontSize: '12px', 
                                color: user?.role === 'Group Leader' ? '#EA4335' : '#1A73E8',
                                fontWeight: '500',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}>
                                {user?.role}
                            </div>
                        </div>
                        
                        {/* Menu Items - Google Material Style */}
                        <div>
                            <button
                                onClick={() => {
                                    setShowDropdown(false);
                                    // Add profile navigation here
                                }}
                                style={{
                                    width: '100%',
                                    textAlign: 'left',
                                    padding: '12px 20px',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    color: 'var(--google-maps-text-primary)',
                                    transition: 'background-color var(--transition-standard)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 'var(--spacing-3)',
                                    fontFamily: 'var(--font-family-secondary)'
                                }}
                                onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--google-gray-50)'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--google-maps-text-secondary)">
                                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                                </svg>
                                Profile Settings
                            </button>
                            
                            <button
                                onClick={() => {
                                    setShowDropdown(false);
                                    // Add help navigation here
                                }}
                                style={{
                                    width: '100%',
                                    textAlign: 'left',
                                    padding: '12px 20px',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    color: 'var(--google-maps-text-primary)',
                                    transition: 'background-color var(--transition-standard)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 'var(--spacing-3)',
                                    fontFamily: 'var(--font-family-secondary)'
                                }}
                                onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--google-gray-50)'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--google-maps-text-secondary)">
                                    <path d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z"/>
                                </svg>
                                Help & Documentation
                            </button>
                            
                            <div style={{ borderTop: '1px solid var(--google-gray-200)', marginTop: '4px' }}>
                                <button
                                    onClick={() => {
                                        setShowDropdown(false);
                                        handleLogout();
                                    }}
                                    style={{
                                        width: '100%',
                                        textAlign: 'left',
                                        padding: '12px 20px',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        color: 'var(--google-red)',
                                        fontWeight: '500',
                                        transition: 'background-color var(--transition-standard)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 'var(--spacing-3)',
                                        fontFamily: 'var(--font-family-secondary)'
                                    }}
                                    onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(234, 67, 53, 0.04)'}
                                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--google-red)">
                                        <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
                                    </svg>
                                    Sign Out
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
                        zIndex: 1000
                    }}
                    onClick={() => setShowDropdown(false)}
                />
            )}
        </header>
    );
};

export default Header;
