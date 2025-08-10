import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#ffffff',
            fontFamily: 'var(--font-family-primary)'
        }}>
            {/* Google Maps Style Header */}
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
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
                {/* Google Maps Logo */}
                <Link to="/" style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 'var(--spacing-3)', 
                    textDecoration: 'none'
                }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
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
                        fontFamily: 'var(--font-family-primary)'
                    }}>
                        Journey Tracker
                    </h1>
                </Link>

                {/* Google Style Header Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Link 
                        to="/login" 
                        style={{
                            textDecoration: 'none',
                            color: 'var(--google-blue)',
                            fontSize: '14px',
                            fontWeight: '500',
                            padding: '8px 16px',
                            borderRadius: '4px',
                            transition: 'background-color var(--transition-standard)',
                            border: 'none',
                            backgroundColor: 'transparent',
                            fontFamily: 'var(--font-family-primary)'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = 'rgba(26, 115, 232, 0.04)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = 'transparent';
                        }}
                    >
                        Sign In
                    </Link>
                    <Link 
                        to="/signup" 
                        style={{
                            textDecoration: 'none',
                            backgroundColor: 'var(--google-blue)',
                            color: 'white',
                            padding: '10px 24px',
                            borderRadius: '4px',
                            fontSize: '14px',
                            fontWeight: '500',
                            transition: 'all var(--transition-standard)',
                            border: 'none',
                            boxShadow: 'var(--elevation-2)',
                            fontFamily: 'var(--font-family-primary)',
                            textTransform: 'none'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = 'var(--google-blue-dark)';
                            e.target.style.boxShadow = 'var(--elevation-4)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = 'var(--google-blue)';
                            e.target.style.boxShadow = 'var(--elevation-2)';
                        }}
                    >
                        Get Started
                    </Link>
                </div>
            </header>

            {/* Google Maps Style Hero Section */}
            <section style={{
                padding: '80px 24px 120px',
                textAlign: 'center',
                backgroundColor: '#ffffff',
                position: 'relative'
            }}>
                <div style={{ 
                    maxWidth: '1200px',
                    margin: '0 auto'
                }}>
                    <h1 style={{
                        fontSize: 'clamp(3rem, 5vw, 4.5rem)',
                        fontWeight: '400',
                        marginBottom: '24px',
                        color: '#3c4043',
                        lineHeight: 1.2,
                        letterSpacing: '-0.01em',
                        fontFamily: 'var(--font-family-primary)'
                    }}>
                        Track Your Journey<br />
                        <span style={{
                            color: '#1a73e8',
                            fontWeight: '400'
                        }}>
                            Share Your Adventure
                        </span>
                    </h1>
                    
                    <p style={{
                        fontSize: '18px',
                        color: '#5f6368',
                        marginBottom: '48px',
                        maxWidth: '720px',
                        margin: '0 auto 48px',
                        lineHeight: 1.5,
                        fontFamily: 'var(--font-family-secondary)'
                    }}>
                        Plan, track, and share your journeys with real-time location sharing, 
                        interactive maps, and seamless group coordination. Built with the reliability 
                        and precision you expect from modern mapping technology.
                    </p>

                    <div style={{
                        display: 'flex',
                        gap: '16px',
                        justifyContent: 'center',
                        flexWrap: 'wrap',
                        marginBottom: '80px'
                    }}>
                        <Link 
                            to="/signup" 
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                backgroundColor: '#1a73e8',
                                color: 'white',
                                padding: '14px 32px',
                                textDecoration: 'none',
                                borderRadius: '4px',
                                fontSize: '16px',
                                fontWeight: '500',
                                transition: 'all var(--transition-standard)',
                                border: 'none',
                                boxShadow: 'var(--elevation-2)',
                                fontFamily: 'var(--font-family-primary)',
                                textTransform: 'none'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = '#1557b0';
                                e.target.style.boxShadow = 'var(--elevation-4)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = '#1a73e8';
                                e.target.style.boxShadow = 'var(--elevation-2)';
                            }}
                        >
                            Get Started Free
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z"/>
                            </svg>
                        </Link>
                        
                        <Link 
                            to="/demo" 
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                backgroundColor: 'transparent',
                                color: '#1a73e8',
                                padding: '14px 32px',
                                textDecoration: 'none',
                                borderRadius: '4px',
                                fontSize: '16px',
                                fontWeight: '500',
                                transition: 'all var(--transition-standard)',
                                border: '1px solid #dadce0',
                                fontFamily: 'var(--font-family-primary)',
                                textTransform: 'none'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = '#f8f9fa';
                                e.target.style.borderColor = '#1a73e8';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = 'transparent';
                                e.target.style.borderColor = '#dadce0';
                            }}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M8 5v14l11-7z"/>
                            </svg>
                            Watch Demo
                        </Link>
                    </div>

                    {/* Google Style Feature Preview */}
                    <div style={{
                        background: '#f8f9fa',
                        borderRadius: '8px',
                        padding: '48px 32px',
                        maxWidth: '960px',
                        margin: '0 auto',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                        border: '1px solid #e8eaed'
                    }}>
                        <div style={{
                            backgroundColor: '#ffffff',
                            borderRadius: '8px',
                            height: '400px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '48px',
                            color: '#1a73e8',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                            border: '1px solid #e8eaed'
                        }}>
                            🗺️
                        </div>
                        <p style={{
                            marginTop: '16px',
                            fontSize: '14px',
                            color: '#5f6368',
                            fontFamily: 'var(--font-family-secondary)'
                        }}>
                            Interactive map interface powered by OpenStreetMap technology
                        </p>
                    </div>
                </div>
            </section>

            {/* Google Material Features Grid */}
            <section style={{
                padding: '80px 24px',
                backgroundColor: '#f8f9fa'
            }}>
                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto'
                }}>
                    <div style={{
                        textAlign: 'center',
                        marginBottom: '64px'
                    }}>
                        <h2 style={{
                            fontSize: '36px',
                            fontWeight: '400',
                            color: '#3c4043',
                            marginBottom: '16px',
                            fontFamily: 'var(--font-family-primary)'
                        }}>
                            Everything you need to track journeys
                        </h2>
                        <p style={{
                            fontSize: '16px',
                            color: '#5f6368',
                            maxWidth: '600px',
                            margin: '0 auto',
                            lineHeight: 1.5,
                            fontFamily: 'var(--font-family-secondary)'
                        }}>
                            Powerful features designed for seamless location sharing and group coordination
                        </p>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '32px'
                    }}>
                        {/* Interactive Maps Feature */}
                        <div style={{
                            backgroundColor: '#ffffff',
                            borderRadius: '8px',
                            padding: '32px',
                            textAlign: 'left',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                            border: '1px solid #e8eaed',
                            transition: 'all var(--transition-standard)'
                        }}>
                            <div style={{
                                width: '48px',
                                height: '48px',
                                backgroundColor: '#e8f0fe',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '16px'
                            }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="#1a73e8">
                                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                                </svg>
                            </div>
                            <h3 style={{
                                fontSize: '18px',
                                fontWeight: '500',
                                color: '#3c4043',
                                marginBottom: '8px',
                                fontFamily: 'var(--font-family-primary)'
                            }}>
                                Interactive Maps
                            </h3>
                            <p style={{
                                color: '#5f6368',
                                lineHeight: 1.5,
                                margin: 0,
                                fontSize: '14px',
                                fontFamily: 'var(--font-family-secondary)'
                            }}>
                                Powered by OpenStreetMap with real-time location tracking and custom markers.
                            </p>
                        </div>

                        {/* Group Coordination Feature */}
                        <div style={{
                            backgroundColor: '#ffffff',
                            borderRadius: '8px',
                            padding: '32px',
                            textAlign: 'left',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                            border: '1px solid #e8eaed',
                            transition: 'all var(--transition-standard)'
                        }}>
                            <div style={{
                                width: '48px',
                                height: '48px',
                                backgroundColor: '#fce8e6',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '16px'
                            }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="#ea4335">
                                    <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.5 7h-3c-.83 0-1.54.5-1.85 1.22l-1.92 5.78H9.5v6H11v-6h1.23l2.77-8.31V4c0-1.11-.89-2-2-2s-2 .89-2 2 .89 2 2 2-2-.89-2-2z"/>
                                </svg>
                            </div>
                            <h3 style={{
                                fontSize: '18px',
                                fontWeight: '500',
                                color: '#3c4043',
                                marginBottom: '8px',
                                fontFamily: 'var(--font-family-primary)'
                            }}>
                                Group Coordination
                            </h3>
                            <p style={{
                                color: '#5f6368',
                                lineHeight: 1.5,
                                margin: 0,
                                fontSize: '14px',
                                fontFamily: 'var(--font-family-secondary)'
                            }}>
                                Share your location with group members and coordinate journeys seamlessly.
                            </p>
                        </div>

                        {/* Real-time Updates Feature */}
                        <div style={{
                            backgroundColor: '#ffffff',
                            borderRadius: '8px',
                            padding: '32px',
                            textAlign: 'left',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                            border: '1px solid #e8eaed',
                            transition: 'all var(--transition-standard)'
                        }}>
                            <div style={{
                                width: '48px',
                                height: '48px',
                                backgroundColor: '#e6f4ea',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '16px'
                            }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="#34a853">
                                    <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0 0 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/>
                                </svg>
                            </div>
                            <h3 style={{
                                fontSize: '18px',
                                fontWeight: '500',
                                color: '#3c4043',
                                marginBottom: '8px',
                                fontFamily: 'var(--font-family-primary)'
                            }}>
                                Real-time Updates
                            </h3>
                            <p style={{
                                color: '#5f6368',
                                lineHeight: 1.5,
                                margin: 0,
                                fontSize: '14px',
                                fontFamily: 'var(--font-family-secondary)'
                            }}>
                                Get instant updates on location changes and journey progress.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Google Style CTA Section */}
            <section style={{
                padding: '80px 24px',
                backgroundColor: '#ffffff',
                textAlign: 'center'
            }}>
                <div style={{
                    maxWidth: '800px',
                    margin: '0 auto'
                }}>
                    <h2 style={{
                        fontSize: '36px',
                        fontWeight: '400',
                        marginBottom: '16px',
                        color: '#3c4043',
                        fontFamily: 'var(--font-family-primary)'
                    }}>
                        Ready to start your journey?
                    </h2>
                    
                    <p style={{
                        fontSize: '16px',
                        marginBottom: '32px',
                        color: '#5f6368',
                        lineHeight: 1.5,
                        maxWidth: '600px',
                        margin: '0 auto 32px',
                        fontFamily: 'var(--font-family-secondary)'
                    }}>
                        Join thousands of users already tracking their adventures together. 
                        Start for free and upgrade when you're ready.
                    </p>

                    <Link 
                        to="/signup" 
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            backgroundColor: '#1a73e8',
                            color: 'white',
                            padding: '16px 40px',
                            textDecoration: 'none',
                            borderRadius: '4px',
                            fontSize: '16px',
                            fontWeight: '500',
                            transition: 'all var(--transition-standard)',
                            border: 'none',
                            boxShadow: 'var(--elevation-2)',
                            fontFamily: 'var(--font-family-primary)',
                            textTransform: 'none'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#1557b0';
                            e.target.style.boxShadow = 'var(--elevation-4)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = '#1a73e8';
                            e.target.style.boxShadow = 'var(--elevation-2)';
                        }}
                    >
                        Get Started Free
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z"/>
                        </svg>
                    </Link>
                </div>
            </section>

            {/* Google Style Footer */}
            <footer style={{
                backgroundColor: '#f8f9fa',
                borderTop: '1px solid #e8eaed',
                padding: '48px 24px 32px',
                textAlign: 'center'
            }}>
                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '12px',
                        marginBottom: '24px'
                    }}>
                        <div style={{
                            width: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#EA4335"/>
                                <path d="M12 8c0.55 0 1 0.45 1 1s-0.45 1-1 1-1-0.45-1-1 0.45-1 1-1z" fill="#ffffff"/>
                            </svg>
                        </div>
                        <span style={{
                            fontSize: '18px',
                            fontWeight: '400',
                            color: '#3c4043',
                            fontFamily: 'var(--font-family-primary)'
                        }}>
                            Journey Tracker
                        </span>
                    </div>
                    
                    <p style={{
                        color: '#5f6368',
                        margin: 0,
                        fontSize: '14px',
                        fontFamily: 'var(--font-family-secondary)'
                    }}>
                        © 2024 Journey Tracker. Built with Google-inspired design principles and OpenStreetMap.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
