import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <header style={{
            backgroundColor: '#667eea',
            padding: '15px 20px',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <h1 style={{ 
                    margin: 0, 
                    fontSize: '1.5rem',
                    fontWeight: 'bold'
                }}>
                    🗺️ Journey Tracker
                </h1>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <span style={{ fontSize: '14px' }}>
                    Welcome, <strong>{user?.username}</strong>
                    <span style={{ 
                        marginLeft: '5px',
                        fontSize: '16px'
                    }}>
                        {user?.role === 'Group Leader' ? '👑' : '👤'}
                    </span>
                </span>
                
                <button
                    onClick={handleLogout}
                    style={{
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '20px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        transition: 'background-color 0.3s'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.3)'}
                    onMouseOut={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.2)'}
                >
                    Sign Out
                </button>
            </div>
        </header>
    );
};

export default Header;
