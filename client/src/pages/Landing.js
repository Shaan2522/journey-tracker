import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
    
    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 25%, #334155 50%, #475569 75%, #64748B 100%)',
            color: '#F8FAFC'
        }}>
            {/* Header */}
            <header style={{
                position: 'sticky',
                top: 0,
                zIndex: 1000,
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderBottom: '1px solid rgba(148, 163, 184, 0.2)',
                padding: '0 var(--spacing-6)',
                height: 'var(--header-height)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -1px rgb(0 0 0 / 0.06)',
                transition: 'all var(--transition-normal)'
            }}>
                {/* Logo */}
                <Link to="/" style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 'var(--spacing-3)', 
                    textDecoration: 'none',
                    transition: 'all var(--transition-normal)'
                }}>
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
                        color: '#F8FAFC',
                        background: 'linear-gradient(135deg, #14B8A6 0%, #F97316 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                    }}>
                        Journey Tracker
                    </h1>
                </Link>

                {/* Header Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)' }}>
                    {/* Auth Buttons */}
                    <Link 
                        to="/login" 
                        style={{
                            textDecoration: 'none',
                            color: '#CBD5E1',
                            fontSize: 'var(--font-size-base)',
                            fontWeight: 'var(--font-weight-medium)',
                            padding: 'var(--spacing-2) var(--spacing-4)',
                            borderRadius: 'var(--radius-md)',
                            transition: 'all var(--transition-normal)',
                            border: 'none',
                            backgroundColor: 'transparent'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = 'rgba(148, 163, 184, 0.2)';
                            e.target.style.color = '#F8FAFC';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = 'transparent';
                            e.target.style.color = '#CBD5E1';
                        }}
                    >
                        Sign In
                    </Link>
                    <Link 
                        to="/signup" 
                        style={{
                            textDecoration: 'none',
                            backgroundColor: '#14B8A6',
                            color: 'white',
                            padding: 'var(--spacing-3) var(--spacing-6)',
                            borderRadius: 'var(--radius-md)',
                            fontSize: 'var(--font-size-base)',
                            fontWeight: 'var(--font-weight-semibold)',
                            transition: 'all var(--transition-normal)',
                            border: 'none',
                            boxShadow: '0 4px 12px rgba(20, 184, 166, 0.4)',
                            display: 'inline-block'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#0F9B8E';
                            e.target.style.transform = 'translateY(-1px)';
                            e.target.style.boxShadow = '0 8px 20px rgba(20, 184, 166, 0.5)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = '#14B8A6';
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 4px 12px rgba(20, 184, 166, 0.4)';
                        }}
                    >
                        Get Started
                    </Link>
                </div>
            </header>

            {/* Hero Section */}
            <section style={{
                padding: '8rem var(--spacing-6) 6rem',
                textAlign: 'center',
                background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.1) 0%, rgba(249, 115, 22, 0.1) 100%)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Background Pattern */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: `
                        radial-gradient(circle at 20% 80%, rgba(20, 184, 166, 0.3) 0%, transparent 60%),
                        radial-gradient(circle at 80% 20%, rgba(249, 115, 22, 0.2) 0%, transparent 60%),
                        radial-gradient(circle at 40% 40%, rgba(147, 51, 234, 0.1) 0%, transparent 60%)
                    `,
                    zIndex: 0
                }} />
                
                <div style={{ 
                    position: 'relative',
                    zIndex: 1,
                    maxWidth: '1200px',
                    margin: '0 auto'
                }}>
                    <h1 style={{
                        fontSize: 'clamp(3rem, 6vw, 5rem)',
                        fontWeight: '900',
                        marginBottom: 'var(--spacing-6)',
                        color: '#F8FAFC',
                        lineHeight: 1.1,
                        letterSpacing: '-0.02em'
                    }}>
                        Track Your Journey<br />
                        <span style={{
                            background: 'linear-gradient(135deg, #14B8A6 0%, #F97316 50%, #A855F7 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                        }}>
                            Share Your Adventure
                        </span>
                    </h1>
                    
                    <p style={{
                        fontSize: 'var(--font-size-xl)',
                        color: '#CBD5E1',
                        marginBottom: 'var(--spacing-8)',
                        maxWidth: '700px',
                        margin: '0 auto var(--spacing-8)',
                        lineHeight: 1.6,
                        opacity: 0.9
                    }}>
                        Plan, track, and share your journeys with real-time location sharing, 
                        interactive maps, and seamless group coordination. Perfect for adventures, 
                        trips, and everyday navigation.
                    </p>

                    <div style={{
                        display: 'flex',
                        gap: 'var(--spacing-4)',
                        justifyContent: 'center',
                        flexWrap: 'wrap',
                        marginBottom: 'var(--spacing-12)'
                    }}>
                        <Link 
                            to="/signup" 
                            style={{
                                textDecoration: 'none',
                                background: 'linear-gradient(135deg, #14B8A6 0%, #0F9B8E 100%)',
                                color: 'white',
                                fontSize: 'var(--font-size-lg)',
                                fontWeight: '600',
                                padding: 'var(--spacing-4) var(--spacing-8)',
                                borderRadius: 'var(--radius-full)',
                                transition: 'all var(--transition-normal)',
                                border: 'none',
                                boxShadow: '0 8px 32px rgba(20, 184, 166, 0.4), 0 4px 16px rgba(20, 184, 166, 0.2)',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 'var(--spacing-2)',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.transform = 'translateY(-3px) scale(1.02)';
                                e.target.style.boxShadow = '0 12px 40px rgba(20, 184, 166, 0.5), 0 6px 20px rgba(20, 184, 166, 0.3)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'translateY(0) scale(1)';
                                e.target.style.boxShadow = '0 8px 32px rgba(20, 184, 166, 0.4), 0 4px 16px rgba(20, 184, 166, 0.2)';
                            }}
                        >
                            Start Tracking Free
                            <span style={{ fontSize: '1.2em' }}>→</span>
                        </Link>
                        <button 
                            style={{
                                background: 'rgba(148, 163, 184, 0.1)',
                                backdropFilter: 'blur(10px)',
                                WebkitBackdropFilter: 'blur(10px)',
                                color: '#F8FAFC',
                                fontSize: 'var(--font-size-lg)',
                                fontWeight: '600',
                                padding: 'var(--spacing-4) var(--spacing-8)',
                                borderRadius: 'var(--radius-full)',
                                border: '1px solid rgba(148, 163, 184, 0.3)',
                                transition: 'all var(--transition-normal)',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 'var(--spacing-2)',
                                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.background = 'rgba(148, 163, 184, 0.2)';
                                e.target.style.borderColor = 'rgba(148, 163, 184, 0.5)';
                                e.target.style.transform = 'translateY(-2px)';
                                e.target.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.15)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.background = 'rgba(148, 163, 184, 0.1)';
                                e.target.style.borderColor = 'rgba(148, 163, 184, 0.3)';
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.1)';
                            }}
                        >
                            <span style={{ fontSize: '1.1em' }}>▶</span>
                            Watch Demo
                        </button>
                    </div>

                    {/* Feature Preview */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: 'var(--spacing-8)',
                        marginTop: 'var(--spacing-16)'
                    }}>
                        <div style={{
                            textAlign: 'left',
                            background: 'rgba(248, 250, 252, 0.1)',
                            backdropFilter: 'blur(20px)',
                            WebkitBackdropFilter: 'blur(20px)',
                            border: '1px solid rgba(148, 163, 184, 0.2)',
                            borderRadius: 'var(--radius-xl)',
                            padding: 'var(--spacing-8)',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                            transition: 'all var(--transition-normal)',
                            cursor: 'pointer',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-8px)';
                            e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
                            e.currentTarget.style.background = 'rgba(248, 250, 252, 0.15)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
                            e.currentTarget.style.background = 'rgba(248, 250, 252, 0.1)';
                        }}
                        >
                            <div style={{
                                width: '3rem',
                                height: '3rem',
                                backgroundColor: 'rgba(20, 184, 166, 0.1)',
                                borderRadius: 'var(--radius-lg)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.5rem',
                                marginBottom: 'var(--spacing-4)'
                            }}>
                                🗺️
                            </div>
                            <h3 style={{
                                fontSize: 'var(--font-size-lg)',
                                fontWeight: 'var(--font-weight-semibold)',
                                color: 'var(--neutral-900)',
                                marginBottom: 'var(--spacing-2)'
                            }}>
                                Interactive Maps
                            </h3>
                            <p style={{
                                color: 'var(--neutral-600)',
                                lineHeight: 1.5,
                                margin: 0
                            }}>
                                Powered by OpenStreetMap with real-time location tracking and custom markers.
                            </p>
                        </div>

                        <div style={{
                            textAlign: 'left',
                            background: 'rgba(255, 255, 255, 0.08)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: 'var(--radius-xl)',
                            padding: 'var(--spacing-6)',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05)',
                            transition: 'all var(--transition-normal)',
                            cursor: 'pointer',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                            e.currentTarget.style.boxShadow = '0 32px 64px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(249, 115, 22, 0.3)';
                            e.currentTarget.style.background = 'rgba(249, 115, 22, 0.15)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0) scale(1)';
                            e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05)';
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                        }}
                        >
                            <div style={{
                                width: '3rem',
                                height: '3rem',
                                background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.3), rgba(249, 115, 22, 0.1))',
                                borderRadius: 'var(--radius-lg)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.5rem',
                                marginBottom: 'var(--spacing-4)',
                                border: '1px solid rgba(249, 115, 22, 0.2)'
                            }}>
                                👥
                            </div>
                            <h3 style={{
                                fontSize: 'var(--font-size-lg)',
                                fontWeight: '700',
                                color: '#F8FAFC',
                                marginBottom: 'var(--spacing-2)',
                                letterSpacing: '-0.01em'
                            }}>
                                Group Coordination
                            </h3>
                            <p style={{
                                color: '#CBD5E1',
                                lineHeight: 1.6,
                                margin: 0,
                                fontSize: '0.95rem'
                            }}>
                                Share your location with group members and coordinate journeys seamlessly.
                            </p>
                        </div>

                        <div style={{
                            textAlign: 'left',
                            background: 'rgba(255, 255, 255, 0.08)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: 'var(--radius-xl)',
                            padding: 'var(--spacing-6)',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05)',
                            transition: 'all var(--transition-normal)',
                            cursor: 'pointer',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                            e.currentTarget.style.boxShadow = '0 32px 64px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(168, 85, 247, 0.3)';
                            e.currentTarget.style.background = 'rgba(168, 85, 247, 0.15)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0) scale(1)';
                            e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05)';
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                        }}
                        >
                            <div style={{
                                width: '3rem',
                                height: '3rem',
                                background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.3), rgba(168, 85, 247, 0.1))',
                                borderRadius: 'var(--radius-lg)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.5rem',
                                marginBottom: 'var(--spacing-4)',
                                border: '1px solid rgba(168, 85, 247, 0.2)'
                            }}>
                                ⚡
                            </div>
                            <h3 style={{
                                fontSize: 'var(--font-size-lg)',
                                fontWeight: '700',
                                color: '#F8FAFC',
                                marginBottom: 'var(--spacing-2)',
                                letterSpacing: '-0.01em'
                            }}>
                                Real-time Updates
                            </h3>
                            <p style={{
                                color: '#CBD5E1',
                                lineHeight: 1.6,
                                margin: 0,
                                fontSize: '0.95rem'
                            }}>
                                Get instant updates on location changes and journey progress.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How it Works Section */}
            <section style={{
                padding: '6rem var(--spacing-6)',
                background: 'rgba(15, 23, 42, 0.9)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'radial-gradient(circle at 30% 70%, rgba(20, 184, 166, 0.15) 0%, transparent 50%), radial-gradient(circle at 70% 30%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)',
                    pointerEvents: 'none'
                }}></div>
                
                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    textAlign: 'center',
                    position: 'relative'
                }}>
                    <h2 style={{
                        fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
                        fontWeight: '900',
                        background: 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 50%, #CBD5E1 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        marginBottom: 'var(--spacing-4)',
                        letterSpacing: '-0.02em'
                    }}>
                        How It Works
                    </h2>
                    
                    <p style={{
                        fontSize: 'var(--font-size-lg)',
                        color: '#94A3B8',
                        marginBottom: 'var(--spacing-12)',
                        maxWidth: '600px',
                        margin: '0 auto var(--spacing-12)',
                        lineHeight: 1.6
                    }}>
                        Get started in three simple steps and never lose track of your group again.
                    </p>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                        gap: 'var(--spacing-12)',
                        marginTop: 'var(--spacing-8)'
                    }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{
                                width: '5rem',
                                height: '5rem',
                                background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.8) 0%, rgba(20, 184, 166, 1) 100%)',
                                borderRadius: 'var(--radius-full)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.75rem',
                                fontWeight: '800',
                                color: 'white',
                                margin: '0 auto var(--spacing-6)',
                                boxShadow: '0 20px 40px rgba(20, 184, 166, 0.4), 0 0 0 1px rgba(20, 184, 166, 0.3)',
                                border: '2px solid rgba(20, 184, 166, 0.2)'
                            }}>
                                1
                            </div>
                            <h3 style={{
                                fontSize: 'var(--font-size-xl)',
                                fontWeight: '700',
                                color: '#F8FAFC',
                                marginBottom: 'var(--spacing-3)',
                                letterSpacing: '-0.01em'
                            }}>
                                Create Account
                            </h3>
                            <p style={{
                                color: '#CBD5E1',
                                lineHeight: 1.6,
                                fontSize: '1rem'
                            }}>
                                Sign up for free in seconds. No credit card required.
                            </p>
                        </div>

                        <div style={{ textAlign: 'center' }}>
                            <div style={{
                                width: '5rem',
                                height: '5rem',
                                background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.8) 0%, rgba(249, 115, 22, 1) 100%)',
                                borderRadius: 'var(--radius-full)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.75rem',
                                fontWeight: '800',
                                color: 'white',
                                margin: '0 auto var(--spacing-6)',
                                boxShadow: '0 20px 40px rgba(249, 115, 22, 0.4), 0 0 0 1px rgba(249, 115, 22, 0.3)',
                                border: '2px solid rgba(249, 115, 22, 0.2)'
                            }}>
                                2
                            </div>
                            <h3 style={{
                                fontSize: 'var(--font-size-xl)',
                                fontWeight: '700',
                                color: '#F8FAFC',
                                marginBottom: 'var(--spacing-3)',
                                letterSpacing: '-0.01em'
                            }}>
                                Start Journey
                            </h3>
                            <p style={{
                                color: '#CBD5E1',
                                lineHeight: 1.6,
                                fontSize: '1rem'
                            }}>
                                Create a new journey or join an existing one with your group.
                            </p>
                        </div>

                        <div style={{ textAlign: 'center' }}>
                            <div style={{
                                width: '5rem',
                                height: '5rem',
                                background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.8) 0%, rgba(168, 85, 247, 1) 100%)',
                                borderRadius: 'var(--radius-full)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.75rem',
                                fontWeight: '800',
                                color: 'white',
                                margin: '0 auto var(--spacing-6)',
                                boxShadow: '0 20px 40px rgba(168, 85, 247, 0.4), 0 0 0 1px rgba(168, 85, 247, 0.3)',
                                border: '2px solid rgba(168, 85, 247, 0.2)'
                            }}>
                                3
                            </div>
                            <h3 style={{
                                fontSize: 'var(--font-size-xl)',
                                fontWeight: '700',
                                color: '#F8FAFC',
                                marginBottom: 'var(--spacing-3)',
                                letterSpacing: '-0.01em'
                            }}>
                                Track Together
                            </h3>
                            <p style={{
                                color: '#CBD5E1',
                                lineHeight: 1.6,
                                fontSize: '1rem'
                            }}>
                                See everyone's location in real-time on interactive maps.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section style={{
                padding: '6rem var(--spacing-6)',
                background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 50%, rgba(51, 65, 85, 0.85) 100%)',
                backdropFilter: 'blur(20px)',
                color: 'white',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'radial-gradient(circle at 20% 50%, rgba(20, 184, 166, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(249, 115, 22, 0.2) 0%, transparent 50%), radial-gradient(circle at 50% 80%, rgba(168, 85, 247, 0.2) 0%, transparent 50%)',
                    pointerEvents: 'none'
                }}></div>
                
                <div style={{
                    maxWidth: '900px',
                    margin: '0 auto',
                    position: 'relative'
                }}>
                    <h2 style={{
                        fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                        fontWeight: '900',
                        background: 'linear-gradient(135deg, #FFFFFF 0%, #E2E8F0 50%, #CBD5E1 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        marginBottom: 'var(--spacing-6)',
                        letterSpacing: '-0.02em'
                    }}>
                        Ready to Start Your Journey?
                    </h2>
                    
                    <p style={{
                        fontSize: 'var(--font-size-xl)',
                        marginBottom: 'var(--spacing-10)',
                        color: '#CBD5E1',
                        lineHeight: 1.6,
                        maxWidth: '700px',
                        margin: '0 auto var(--spacing-10)'
                    }}>
                        Join thousands of users already tracking their adventures together. 
                        Start for free and upgrade when you're ready.
                    </p>

                    <div style={{
                        display: 'flex',
                        gap: 'var(--spacing-6)',
                        justifyContent: 'center',
                        flexWrap: 'wrap'
                    }}>
                        <Link to="/signup" style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 'var(--spacing-3)',
                            background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.9) 0%, rgba(20, 184, 166, 1) 100%)',
                            color: 'white',
                            padding: 'var(--spacing-5) var(--spacing-10)',
                            textDecoration: 'none',
                            borderRadius: 'var(--radius-full)',
                            fontSize: 'var(--font-size-lg)',
                            fontWeight: '700',
                            transition: 'all var(--transition-normal)',
                            boxShadow: '0 20px 40px rgba(20, 184, 166, 0.4), 0 0 0 1px rgba(20, 184, 166, 0.3)',
                            border: '2px solid rgba(20, 184, 166, 0.2)',
                            backdropFilter: 'blur(10px)',
                            letterSpacing: '-0.01em'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-4px) scale(1.05)';
                            e.target.style.boxShadow = '0 25px 50px rgba(20, 184, 166, 0.5), 0 0 0 1px rgba(20, 184, 166, 0.4)';
                            e.target.style.background = 'linear-gradient(135deg, rgba(20, 184, 166, 1) 0%, rgba(6, 182, 212, 1) 100%)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0) scale(1)';
                            e.target.style.boxShadow = '0 20px 40px rgba(20, 184, 166, 0.4), 0 0 0 1px rgba(20, 184, 166, 0.3)';
                            e.target.style.background = 'linear-gradient(135deg, rgba(20, 184, 166, 0.9) 0%, rgba(20, 184, 166, 1) 100%)';
                        }}
                        >
                            Start Free Trial
                            <span style={{ fontSize: '1.3em' }}>→</span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer style={{
                background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(30, 41, 59, 0.95) 100%)',
                backdropFilter: 'blur(20px)',
                color: '#CBD5E1',
                padding: 'var(--spacing-12) var(--spacing-6) var(--spacing-8)',
                textAlign: 'center',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                position: 'relative'
            }}>
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'radial-gradient(circle at 30% 100%, rgba(20, 184, 166, 0.1) 0%, transparent 50%)',
                    pointerEvents: 'none'
                }}></div>
                
                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    position: 'relative'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 'var(--spacing-3)',
                        marginBottom: 'var(--spacing-6)'
                    }}>
                        <div style={{
                            width: '2.5rem',
                            height: '2.5rem',
                            background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.3) 0%, rgba(20, 184, 166, 0.6) 100%)',
                            borderRadius: 'var(--radius-lg)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.1rem',
                            border: '1px solid rgba(20, 184, 166, 0.2)',
                            backdropFilter: 'blur(10px)'
                        }}>
                            🗺️
                        </div>
                        <span style={{
                            fontSize: 'var(--font-size-xl)',
                            fontWeight: '700',
                            color: '#F8FAFC',
                            letterSpacing: '-0.01em'
                        }}>
                            Journey Tracker
                        </span>
                    </div>
                    
                    <p style={{
                        color: '#94A3B8',
                        margin: 0,
                        fontSize: '0.95rem',
                        lineHeight: 1.5
                    }}>
                        © 2024 Journey Tracker. Built with modern web technologies and OpenStreetMap.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
