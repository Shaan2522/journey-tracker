import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
    return (
        <div style={{ 
            minHeight: '100vh', 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            fontFamily: 'Arial, sans-serif'
        }}>
            {/* Hero Section */}
            <div style={{ 
                textAlign: 'center', 
                padding: '80px 20px 60px',
                maxWidth: '1200px',
                margin: '0 auto'
            }}>
                <h1 style={{ 
                    fontSize: '3.5rem', 
                    marginBottom: '20px',
                    fontWeight: 'bold',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                }}>
                    🗺️ Journey Tracker
                </h1>
                <p style={{ 
                    fontSize: '1.5rem', 
                    marginBottom: '40px',
                    opacity: '0.9',
                    lineHeight: '1.6'
                }}>
                    Real-time group journey tracking made simple and secure
                </p>
                
                <div style={{ marginBottom: '60px' }}>
                    <Link 
                        to="/signup" 
                        style={{
                            display: 'inline-block',
                            backgroundColor: '#ff6b6b',
                            color: 'white',
                            padding: '15px 30px',
                            textDecoration: 'none',
                            borderRadius: '50px',
                            fontSize: '1.2rem',
                            fontWeight: 'bold',
                            margin: '0 10px',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                        onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                    >
                        Get Started Free
                    </Link>
                    <Link 
                        to="/login" 
                        style={{
                            display: 'inline-block',
                            backgroundColor: 'transparent',
                            color: 'white',
                            padding: '15px 30px',
                            textDecoration: 'none',
                            borderRadius: '50px',
                            fontSize: '1.2rem',
                            fontWeight: 'bold',
                            margin: '0 10px',
                            border: '2px solid white',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseOver={(e) => {
                            e.target.style.backgroundColor = 'white';
                            e.target.style.color = '#667eea';
                        }}
                        onMouseOut={(e) => {
                            e.target.style.backgroundColor = 'transparent';
                            e.target.style.color = 'white';
                        }}
                    >
                        Sign In
                    </Link>
                </div>
            </div>

            {/* Features Section */}
            <div style={{ 
                backgroundColor: 'rgba(255,255,255,0.1)',
                padding: '60px 20px',
                backdropFilter: 'blur(10px)'
            }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <h2 style={{ 
                        textAlign: 'center', 
                        fontSize: '2.5rem', 
                        marginBottom: '50px',
                        fontWeight: 'bold'
                    }}>
                        ✨ Amazing Features
                    </h2>
                    
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '30px'
                    }}>
                        <div style={{
                            backgroundColor: 'rgba(255,255,255,0.1)',
                            padding: '30px',
                            borderRadius: '15px',
                            textAlign: 'center',
                            backdropFilter: 'blur(5px)'
                        }}>
                            <div style={{ fontSize: '3rem', marginBottom: '20px' }}>📍</div>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>Real-Time Location Sharing</h3>
                            <p style={{ opacity: '0.9', lineHeight: '1.6' }}>
                                Share your live location with group members and track everyone's progress in real-time
                            </p>
                        </div>

                        <div style={{
                            backgroundColor: 'rgba(255,255,255,0.1)',
                            padding: '30px',
                            borderRadius: '15px',
                            textAlign: 'center',
                            backdropFilter: 'blur(5px)'
                        }}>
                            <div style={{ fontSize: '3rem', marginBottom: '20px' }}>👥</div>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>Group Management</h3>
                            <p style={{ opacity: '0.9', lineHeight: '1.6' }}>
                                Create groups with leaders and members. Share unique codes to invite others to your journey
                            </p>
                        </div>

                        <div style={{
                            backgroundColor: 'rgba(255,255,255,0.1)',
                            padding: '30px',
                            borderRadius: '15px',
                            textAlign: 'center',
                            backdropFilter: 'blur(5px)'
                        }}>
                            <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🗺️</div>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>Interactive Maps</h3>
                            <p style={{ opacity: '0.9', lineHeight: '1.6' }}>
                                View everyone's location on Google Maps with distinct markers for leaders and members
                            </p>
                        </div>

                        <div style={{
                            backgroundColor: 'rgba(255,255,255,0.1)',
                            padding: '30px',
                            borderRadius: '15px',
                            textAlign: 'center',
                            backdropFilter: 'blur(5px)'
                        }}>
                            <div style={{ fontSize: '3rem', marginBottom: '20px' }}>⏱️</div>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>ETA Calculations</h3>
                            <p style={{ opacity: '0.9', lineHeight: '1.6' }}>
                                Get real-time estimated arrival times and distances to your destination
                            </p>
                        </div>

                        <div style={{
                            backgroundColor: 'rgba(255,255,255,0.1)',
                            padding: '30px',
                            borderRadius: '15px',
                            textAlign: 'center',
                            backdropFilter: 'blur(5px)'
                        }}>
                            <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🔒</div>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>Secure & Private</h3>
                            <p style={{ opacity: '0.9', lineHeight: '1.6' }}>
                                Your data is encrypted and secure. Only journey participants can see shared locations
                            </p>
                        </div>

                        <div style={{
                            backgroundColor: 'rgba(255,255,255,0.1)',
                            padding: '30px',
                            borderRadius: '15px',
                            textAlign: 'center',
                            backdropFilter: 'blur(5px)'
                        }}>
                            <div style={{ fontSize: '3rem', marginBottom: '20px' }}>⚡</div>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>Real-Time Updates</h3>
                            <p style={{ opacity: '0.9', lineHeight: '1.6' }}>
                                Instant notifications when members join, leave, or update their locations
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* How It Works Section */}
            <div style={{ 
                padding: '60px 20px',
                maxWidth: '1200px',
                margin: '0 auto'
            }}>
                <h2 style={{ 
                    textAlign: 'center', 
                    fontSize: '2.5rem', 
                    marginBottom: '50px',
                    fontWeight: 'bold'
                }}>
                    🚀 How It Works
                </h2>
                
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '40px',
                    textAlign: 'center'
                }}>
                    <div>
                        <div style={{ 
                            width: '80px', 
                            height: '80px', 
                            backgroundColor: '#ff6b6b', 
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 20px',
                            fontSize: '2rem'
                        }}>1</div>
                        <h3 style={{ fontSize: '1.3rem', marginBottom: '15px' }}>Sign Up</h3>
                        <p style={{ opacity: '0.9' }}>Create your free account in seconds</p>
                    </div>
                    
                    <div>
                        <div style={{ 
                            width: '80px', 
                            height: '80px', 
                            backgroundColor: '#4ecdc4', 
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 20px',
                            fontSize: '2rem'
                        }}>2</div>
                        <h3 style={{ fontSize: '1.3rem', marginBottom: '15px' }}>Create or Join</h3>
                        <p style={{ opacity: '0.9' }}>Start a new journey or join with a code</p>
                    </div>
                    
                    <div>
                        <div style={{ 
                            width: '80px', 
                            height: '80px', 
                            backgroundColor: '#45b7d1', 
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 20px',
                            fontSize: '2rem'
                        }}>3</div>
                        <h3 style={{ fontSize: '1.3rem', marginBottom: '15px' }}>Track Together</h3>
                        <p style={{ opacity: '0.9' }}>See everyone's location in real-time</p>
                    </div>
                </div>
            </div>

            {/* Call to Action */}
            <div style={{ 
                textAlign: 'center', 
                padding: '60px 20px',
                backgroundColor: 'rgba(0,0,0,0.1)'
            }}>
                <h2 style={{ 
                    fontSize: '2.5rem', 
                    marginBottom: '20px',
                    fontWeight: 'bold'
                }}>
                    Ready to Start Your Journey?
                </h2>
                <p style={{ 
                    fontSize: '1.2rem', 
                    marginBottom: '40px',
                    opacity: '0.9'
                }}>
                    Join thousands of users already tracking their journeys together
                </p>
                <Link 
                    to="/signup" 
                    style={{
                        display: 'inline-block',
                        backgroundColor: '#ff6b6b',
                        color: 'white',
                        padding: '20px 40px',
                        textDecoration: 'none',
                        borderRadius: '50px',
                        fontSize: '1.3rem',
                        fontWeight: 'bold',
                        boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
                        transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => e.target.style.transform = 'translateY(-3px)'}
                    onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                >
                    Start Tracking Now - It's Free!
                </Link>
            </div>
        </div>
    );
};

export default Landing;
