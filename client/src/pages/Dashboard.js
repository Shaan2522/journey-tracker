import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import journeyService from '../services/journeyService';
import socketService from '../services/socketService';
import mapService from '../services/mapService';
import Map from '../components/Map';
import DestinationSearch from '../components/DestinationSearch';
import Header from '../components/Header';

const Dashboard = () => {
    const { user, refreshUser } = useAuth();
    const [journey, setJourney] = useState(null);
    const [code, setCode] = useState('');
    const [currentLocation, setCurrentLocation] = useState(null);
    const [locationError, setLocationError] = useState('');
    const [participants, setParticipants] = useState([]);
    const [locationUpdates, setLocationUpdates] = useState({});
    const [travelTimes, setTravelTimes] = useState({});
    const [isConnected, setIsConnected] = useState(false);
    const [destination, setDestination] = useState(null);
    const [selectedParticipantId, setSelectedParticipantId] = useState(null);
    const [participantRoute, setParticipantRoute] = useState(null);
    const [loadingRoute, setLoadingRoute] = useState(false);
    const locationIntervalRef = useRef(null);

    useEffect(() => {
        // Get user's current location when component mounts
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setCurrentLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                },
                (error) => {
                    console.error('Error getting location:', error);
                    setLocationError('Unable to get your location. Using Mumbai as default location.');
                    // Fallback to default location (Mumbai)
                    setCurrentLocation({ lat: 19.0760, lng: 72.8777 });
                }
            );
        } else {
            setLocationError('Geolocation is not supported by this browser.');
            setCurrentLocation({ lat: 19.0760, lng: 72.8777 });
        }

        return () => {
            // Cleanup on unmount
            if (locationIntervalRef.current) {
                clearInterval(locationIntervalRef.current);
            }
            socketService.disconnect();
        };
    }, []);

    const connectToSocket = () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user || !user.token) {
                console.error('No user token found');
                return;
            }

            const socket = socketService.connect(user.token);
        
        socket.on('connect', () => {
            setIsConnected(true);
        });

        socket.on('disconnect', () => {
            setIsConnected(false);
        });

        socketService.onJourneyJoined((data) => {
            console.log('Journey joined:', data);
            setParticipants(data.participants);
        });

        socketService.onLocationUpdate(async (data) => {
            console.log('Location update received:', data);
            const locationData = {
                latitude: data.latitude,
                longitude: data.longitude,
                username: data.username,
                role: data.role,
                timestamp: data.timestamp
            };

            setLocationUpdates(prev => ({
                ...prev,
                [data.userId]: locationData
            }));

            // Calculate travel time to destination if journey exists
            if (journey && journey.destination) {
                try {
                    const travelTime = await mapService.getTravelTimeToDestination(
                        { lat: data.latitude, lng: data.longitude },
                        { 
                            lat: journey.destination.coordinates[1], 
                            lng: journey.destination.coordinates[0] 
                        }
                    );
                    
                    if (travelTime) {
                        setTravelTimes(prev => ({
                            ...prev,
                            [data.userId]: {
                                duration: travelTime.duration,
                                distance: travelTime.distance,
                                timestamp: new Date()
                            }
                        }));
                    }
                } catch (error) {
                    console.error('Error calculating travel time:', error);
                }
            }
        });

        socketService.onUserJoined((data) => {
            console.log('User joined:', data.message);
            // You could show a notification here
        });

        socketService.onUserLeft((data) => {
            console.log('User left:', data.message);
            // Remove user's location from updates
            setLocationUpdates(prev => {
                const updated = { ...prev };
                delete updated[data.user._id];
                return updated;
            });
        });

        socketService.onError((error) => {
            console.error('Socket error:', error);
        });

        // Handle destination updates from group leader
        socketService.onMessage('destination_updated', (data) => {
            setJourney(prev => ({
                ...prev,
                destination: data.destination
            }));
            
            // Show notification
            alert(`🎯 Destination updated by ${data.updatedBy}`);
        });
        } catch (error) {
            console.error('Error connecting to socket:', error);
        }
    };

    const startLocationSharing = (journeyCode) => {
        if (!navigator.geolocation) {
            console.error('Geolocation not supported');
            return;
        }

        // Clear any existing interval
        if (locationIntervalRef.current) {
            clearInterval(locationIntervalRef.current);
        }

        // Send location updates every 10 seconds
        locationIntervalRef.current = setInterval(() => {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    socketService.sendLocationUpdate(journeyCode, latitude, longitude);
                    
                    // Update current location state
                    setCurrentLocation({ lat: latitude, lng: longitude });
                },
                (error) => {
                    console.error('Error getting location for sharing:', error);
                }
            );
        }, 10000); // 10 seconds interval
    };

    // Destination handling functions
    const handleDestinationSelect = async (selectedDestination) => {
        setDestination(selectedDestination);
        
        // If user is a group leader and journey exists, update on server
        if (journey && isGroupLeader()) {
            try {
                const destinationData = {
                    type: 'Point',
                    coordinates: [selectedDestination.lng, selectedDestination.lat]
                };
                
                const response = await journeyService.updateDestination(journey._id, destinationData);
                setJourney(response.data);
                
                // Notify other participants via socket
                try {
                    if (user && user.username) {
                        socketService.sendMessage(journey.code, 'destination_updated', {
                            destination: destinationData,
                            updatedBy: user.username
                        });
                    }
                } catch (error) {
                    console.error('Error notifying participants:', error);
                }
            } catch (error) {
                console.error('Failed to update destination:', error);
                alert('Failed to update destination. Please try again.');
            }
        }
    };

    const getUserRole = () => {
        if (!journey || !participants.length || !user || !user.id) return null;
        
        try {
            // Check if current user is the journey leader
            if (journey.leader === user.id) {
                return 'Group Leader';
            }
            
            // Otherwise, they are a group member
            const participant = participants.find(p => p._id === user.id);
            return participant?.role || 'Group Member';
        } catch (error) {
            console.error('Error getting user role:', error);
            return null;
        }
    };

    const isGroupLeader = () => {
        return getUserRole() === 'Group Leader';
    };

    const handleCreateJourney = async () => {
        if (!currentLocation) {
            alert('Please wait for location to be detected');
            return;
        }
        
        if (!destination) {
            alert('Please select a destination first');
            return;
        }
        
        const destinationData = {
            type: 'Point',
            coordinates: [destination.lng, destination.lat]
        };
        
        try {
            const { data } = await journeyService.createJourney({ destination: destinationData });
            setJourney(data);
            
            // Refresh user data to get updated role (Group Leader)
            refreshUser();
            
            // Connect to socket and start sharing location
            connectToSocket();
            setTimeout(() => {
                socketService.joinJourney(data.code);
                startLocationSharing(data.code);
            }, 1000);
        } catch (error) {
            console.error('Failed to create journey', error);
        }
    };

    const handleJoinJourney = async () => {
        try {
            const { data } = await journeyService.joinJourney(code);
            console.log('🎯 Journey joined successfully:', data);
            console.log('🎯 Journey destination:', data.destination);
            setJourney(data);
            
            // Connect to socket and start sharing location
            connectToSocket();
            setTimeout(() => {
                socketService.joinJourney(data.code);
                startLocationSharing(data.code);
                
                // Force route display if we have current location and destination
                if (currentLocation && data.destination) {
                    console.log('🗺️ Triggering route display for joined journey');
                    console.log('🗺️ Current location:', currentLocation);
                    console.log('🗺️ Journey destination:', data.destination);
                    // The route will be displayed by the Map component's useEffect
                }
            }, 1000);
        } catch (error) {
            console.error('Failed to join journey', error);
        }
    };

    // Handle participant click to show route to destination
    const handleParticipantClick = async (participantId) => {
        if (!journey || !journey.destination || !locationUpdates[participantId]) {
            return;
        }

        setLoadingRoute(true);
        
        try {
            // If same participant is clicked again, hide route
            if (selectedParticipantId === participantId) {
                setSelectedParticipantId(null);
                setParticipantRoute(null);
                setLoadingRoute(false);
                return;
            }

            const participantLocation = locationUpdates[participantId];
            const destinationCoords = {
                lat: journey.destination.coordinates[1],
                lng: journey.destination.coordinates[0]
            };

            const participantCoords = {
                lat: participantLocation.latitude,
                lng: participantLocation.longitude
            };

            // Get route details from map service
            const routeDetails = await mapService.getRouteDetails(
                participantCoords,
                destinationCoords
            );

            if (routeDetails) {
                setSelectedParticipantId(participantId);
                setParticipantRoute(routeDetails.coordinates);
            } else {
                alert('Unable to calculate route for this participant');
            }
        } catch (error) {
            console.error('Error fetching participant route:', error);
            alert('Failed to load route. Please try again.');
        } finally {
            setLoadingRoute(false);
        }
    };

    // Default to Mumbai coordinates if no current location
    const mapCenter = currentLocation || { lat: 19.0760, lng: 72.8777 };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa', fontFamily: 'var(--font-family-primary)' }}>
            <Header />
            <div style={{ 
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '24px',
                paddingTop: '88px'
            }}>
                <div style={{ 
                    marginBottom: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '16px'
                }}>
                    <h1 style={{
                        fontSize: '28px',
                        fontWeight: '400',
                        color: '#3c4043',
                        margin: '0',
                        fontFamily: 'var(--font-family-primary)'
                    }}></h1>
                    {isConnected}
                </div>
                
                {locationError && (
                    <div style={{ 
                        backgroundColor: '#fef7e0',
                        border: '1px solid #fbbc04',
                        borderRadius: '8px',
                        padding: '16px',
                        marginBottom: '24px',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px'
                    }}>
                        <div style={{ 
                            width: '20px',
                            height: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="#ea8600">
                                <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
                            </svg>
                        </div>
                        <div>
                            <div style={{
                                fontSize: '14px',
                                fontWeight: '500',
                                color: '#3c4043',
                                marginBottom: '4px',
                                fontFamily: 'var(--font-family-primary)'
                            }}>Location Notice</div>
                            <div style={{
                                fontSize: '14px',
                                color: '#5f6368',
                                fontFamily: 'var(--font-family-secondary)'
                            }}>{locationError}</div>
                        </div>
                    </div>
                )}
                
                {!journey ? (
                    <div style={{ 
                        backgroundColor: '#ffffff',
                        borderRadius: '8px',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                        border: '1px solid #dadce0',
                        textAlign: 'center', 
                        maxWidth: '700px', 
                        margin: '0 auto',
                        marginBottom: '24px',
                        padding: '48px 40px'
                    }}>
                        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                            <div style={{
                                width: '64px',
                                height: '64px',
                                backgroundColor: '#1a73e8',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '24px',
                                margin: '0 auto 16px auto'
                            }}>
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
                                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                                </svg>
                            </div>
                            <h2 style={{
                                fontSize: '24px',
                                fontWeight: '400',
                                color: '#3c4043',
                                marginBottom: '8px',
                                fontFamily: 'var(--font-family-primary)'
                            }}>Start Your Journey</h2>
                            <p style={{
                                fontSize: '16px',
                                color: '#5f6368',
                                marginBottom: '0',
                                fontFamily: 'var(--font-family-secondary)'
                            }}>
                                Create a new journey or join an existing one to start tracking your group's location
                            </p>
                        </div>
                        
                        <div className="card-content" style={{ textAlign: 'left' }}>
                            {/* Current Location Display */}
                            <div style={{ 
                                padding: 'var(--spacing-4)',
                                backgroundColor: 'var(--primary-50)',
                                border: '1px solid var(--primary-200)',
                                borderRadius: 'var(--radius-lg)',
                                marginBottom: 'var(--spacing-6)',
                                textAlign: 'center'
                            }}>
                                <div style={{ 
                                    fontSize: 'var(--font-size-sm)',
                                    color: 'var(--primary-600)',
                                    marginBottom: 'var(--spacing-1)'
                                }}>
                                    📍 Current Location
                                </div>
                                <div className="text-sm text-neutral-600">
                                    {currentLocation ? 
                                        `${currentLocation.lat.toFixed(4)}, ${currentLocation.lng.toFixed(4)}` : 
                                        'Detecting location...'
                                    }
                                </div>
                            </div>
                            
                            {/* Map for destination selection */}
                            <div style={{ marginBottom: 'var(--spacing-6)' }}>
                                <label className="form-label">
                                    🗺️ Interactive Map
                                </label>
                                <p className="form-description">
                                    Click on the map to select your destination
                                </p>
                                <div style={{ 
                                    border: '1px solid #dadce0', 
                                    borderRadius: '8px', 
                                    overflow: 'hidden',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                }}>
                                    <Map 
                                        center={currentLocation || { lat: 19.0760, lng: 72.8777 }} 
                                        zoom={13} 
                                        participants={[]}
                                        locationUpdates={{}}
                                        currentLocation={currentLocation}
                                        destination={destination}
                                        isLeader={true}
                                        onDestinationSelect={handleDestinationSelect}
                                        showRoute={false}
                                        routeCoordinates={null}
                                        selectedParticipantId={null}
                                    />
                                </div>
                            </div>
                            
                            {/* Destination Selection */}
                            <div style={{ marginBottom: 'var(--spacing-6)' }}>
                                <label className="form-label">
                                    🎯 Or Search for Destination
                                </label>
                                <p className="form-description">
                                    Search for a location by name or address
                                </p>
                                <DestinationSearch 
                                    onDestinationSelect={handleDestinationSelect}
                                    currentLocation={currentLocation}
                                />
                                {destination && (
                                    <div className="alert alert-success" style={{ 
                                        marginTop: 'var(--spacing-3)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 'var(--spacing-2)'
                                    }}>
                                        <span style={{ fontSize: '1.25rem' }}>✅</span>
                                        <div>
                                            <div className="alert-title">Destination Selected</div>
                                            <div className="alert-description">
                                                📍 {destination.lat.toFixed(4)}, {destination.lng.toFixed(4)}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            <div style={{ marginBottom: 'var(--spacing-8)' }}>
                                <button 
                                    className={`btn ${(!currentLocation || !destination) ? 'btn-disabled' : 'btn-primary'} btn-lg`}
                                    onClick={handleCreateJourney} 
                                    disabled={!currentLocation || !destination}
                                    style={{ 
                                        width: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: 'var(--spacing-2)'
                                    }}
                                >
                                    <span style={{ fontSize: '1.25rem' }}>🚀</span>
                                    Create New Journey {!destination && '(Select destination first)'}
                                </button>
                            </div>
                            
                            <div style={{ 
                                borderTop: '1px solid var(--neutral-200)', 
                                paddingTop: 'var(--spacing-6)'
                            }}>
                                <h3 className="heading-sm" style={{ 
                                    textAlign: 'center',
                                    marginBottom: 'var(--spacing-4)'
                                }}>
                                    Or Join an Existing Journey
                                </h3>
                                <div style={{ 
                                    display: 'flex', 
                                    gap: 'var(--spacing-3)',
                                    alignItems: 'flex-end'
                                }}>
                                    <div style={{ flex: 1 }}>
                                        <label className="form-label" htmlFor="journey-code">
                                            Journey Code
                                        </label>
                                        <input
                                            id="journey-code"
                                            type="text"
                                            className="form-input"
                                            placeholder="Enter Journey Code"
                                            value={code}
                                            onChange={(e) => setCode(e.target.value)}
                                        />
                                    </div>
                                    <button 
                                        className={`btn ${!code.trim() ? 'btn-disabled' : 'btn-secondary'}`}
                                        onClick={handleJoinJourney}
                                        disabled={!code.trim()}
                                    >
                                        Join Journey
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="card" style={{ 
                        padding: 0, 
                        overflow: 'hidden',
                        marginBottom: 'var(--spacing-8)'
                    }}>
                        <div style={{ 
                            background: 'linear-gradient(135deg, var(--primary-600) 0%, var(--accent-coral) 100%)',
                            color: 'white', 
                            padding: 'var(--spacing-8)',
                            textAlign: 'center'
                        }}>
                            <div style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '3rem',
                                height: '3rem',
                                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                borderRadius: 'var(--radius-full)',
                                marginBottom: 'var(--spacing-4)',
                                fontSize: '1.5rem'
                            }}>
                                🗺️
                            </div>
                            <h2 style={{ 
                                margin: '0 0 var(--spacing-2) 0', 
                                fontSize: 'var(--font-size-3xl)', 
                                fontWeight: 'var(--font-weight-bold)' 
                            }}>
                                Journey: {journey.code}
                            </h2>
                            <p style={{ 
                                margin: '0 0 var(--spacing-4) 0', 
                                opacity: '0.9',
                                fontSize: 'var(--font-size-base)'
                            }}>
                                Share this code with others to join your journey!
                            </p>
                            <div className="badge" style={{ 
                                backgroundColor: isConnected ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                                color: isConnected ? 'var(--success-100)' : 'var(--error-100)',
                                border: `1px solid ${isConnected ? 'rgba(34, 197, 94, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`
                            }}>
                                {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
                            </div>
                        </div>
                        
                        <div className="dashboard-layout">
                            <div className="map-section">
                                <Map 
                                    center={mapCenter} 
                                    zoom={13} 
                                    participants={participants}
                                    locationUpdates={locationUpdates}
                                    currentLocation={currentLocation}
                                    destination={journey?.destination ? {
                                        lat: journey.destination.coordinates[1],
                                        lng: journey.destination.coordinates[0]
                                    } : destination}
                                    isLeader={isGroupLeader()}
                                    onDestinationSelect={handleDestinationSelect}
                                    showRoute={!!(currentLocation && (journey?.destination || destination))}
                                    routeCoordinates={participantRoute}
                                    selectedParticipantId={selectedParticipantId}
                                />
                                
                                {/* Route Debug Info - Remove after testing */}
                                {process.env.NODE_ENV === 'development' && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '10px',
                                        right: '10px',
                                        background: 'rgba(0,0,0,0.8)',
                                        color: 'white',
                                        padding: '8px',
                                        borderRadius: '4px',
                                        fontSize: '11px',
                                        zIndex: 1000,
                                        maxWidth: '300px'
                                    }}>
                                        <div>Current Location: {currentLocation ? '✅' : '❌'}</div>
                                        <div>Current Coords: {currentLocation ? `${currentLocation.lat.toFixed(4)}, ${currentLocation.lng.toFixed(4)}` : 'None'}</div>
                                        <div>Journey: {journey ? journey.code : 'None'}</div>
                                        <div>Journey Dest: {journey?.destination ? '✅' : '❌'}</div>
                                        {journey?.destination && (
                                            <div>Journey Coords: {journey.destination.coordinates[1].toFixed(4)}, {journey.destination.coordinates[0].toFixed(4)}</div>
                                        )}
                                        <div>Local Dest: {destination ? '✅' : '❌'}</div>
                                        {destination && (
                                            <div>Local Coords: {destination.lat.toFixed(4)}, {destination.lng.toFixed(4)}</div>
                                        )}
                                        <div>Final Dest: {(journey?.destination || destination) ? '✅' : '❌'}</div>
                                        <div>Show Route: {!(currentLocation && (journey?.destination || destination)) ? '✅' : '❌'}</div>
                                    </div>
                                )}
                            </div>
                            
                            <div className="sidebar-section">
                                <h3 className="heading-md" style={{ marginBottom: 'var(--spacing-4)' }}>
                                    Participants ({participants.length})
                                </h3>
                                
                                <div style={{ flex: 1, marginBottom: 'var(--spacing-6)' }}>
                                    {participants.length === 0 ? (
                                        <div style={{
                                            textAlign: 'center',
                                            padding: 'var(--spacing-8)',
                                            color: 'var(--neutral-500)'
                                        }}>
                                            <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-2)' }}>👥</div>
                                            <p className="text-sm">No participants yet</p>
                                        </div>
                                    ) : (
                                        participants.map((participant) => (
                                            <div 
                                                key={`participant-${participant._id}`} 
                                                className="card" 
                                                onClick={() => handleParticipantClick(participant._id)}
                                                style={{ 
                                                    marginBottom: 'var(--spacing-3)',
                                                    padding: 'var(--spacing-4)',
                                                    border: selectedParticipantId === participant._id 
                                                        ? '2px solid var(--primary-teal)' 
                                                        : '1px solid var(--neutral-200)',
                                                    cursor: journey && journey.destination && locationUpdates[participant._id] 
                                                        ? 'pointer' 
                                                        : 'default',
                                                    transition: 'all var(--transition-normal)',
                                                    position: 'relative'
                                                }}
                                                onMouseEnter={(e) => {
                                                    if (journey && journey.destination && locationUpdates[participant._id]) {
                                                        e.target.style.boxShadow = 'var(--shadow-lg)';
                                                        e.target.style.transform = 'translateY(-2px)';
                                                    }
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.target.style.boxShadow = '';
                                                    e.target.style.transform = 'translateY(0)';
                                                }}
                                            >
                                                <div style={{ 
                                                    display: 'flex', 
                                                    alignItems: 'center', 
                                                    gap: 'var(--spacing-3)',
                                                    marginBottom: 'var(--spacing-2)'
                                                }}>
                                                    <div 
                                                        className="avatar avatar-sm" 
                                                        style={{
                                                            backgroundColor: participant.role === 'Group Leader' ? 'var(--accent-coral)' : 'var(--primary-teal)',
                                                            color: 'white'
                                                        }}
                                                    >
                                                        {participant.username[0].toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-neutral-900">
                                                            {participant.username}
                                                            <span style={{ 
                                                                marginLeft: 'var(--spacing-1)',
                                                                fontSize: 'var(--font-size-base)'
                                                            }}>
                                                                {participant.role === 'Group Leader' ? '👑' : '👤'}
                                                            </span>
                                                        </div>
                                                        <div className="text-xs text-neutral-500">
                                                            {participant.role}
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                {locationUpdates[participant._id] && (
                                                    <div className="text-xs text-neutral-400" style={{ marginBottom: 'var(--spacing-2)' }}>
                                                        Last update: {new Date(locationUpdates[participant._id].timestamp).toLocaleTimeString()}
                                                    </div>
                                                )}
                                                
                                                {travelTimes[participant._id] && (
                                                    <div style={{ 
                                                        fontSize: 'var(--font-size-xs)', 
                                                        color: 'var(--neutral-700)',
                                                        backgroundColor: 'var(--primary-50)',
                                                        padding: 'var(--spacing-2)',
                                                        borderRadius: 'var(--radius-md)',
                                                        border: '1px solid var(--primary-200)'
                                                    }}>
                                                        🚗 ETA: {travelTimes[participant._id].duration.text}<br />
                                                        📍 Distance: {travelTimes[participant._id].distance.text}
                                                    </div>
                                                )}
                                                
                                                {/* Route indicators and loading state */}
                                                <div style={{ 
                                                    marginTop: 'var(--spacing-3)',
                                                    paddingTop: 'var(--spacing-2)',
                                                    borderTop: '1px solid var(--neutral-200)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between'
                                                }}>
                                                    {journey && journey.destination && locationUpdates[participant._id] ? (
                                                        <>
                                                            <div className="text-xs text-neutral-500">
                                                                {selectedParticipantId === participant._id 
                                                                    ? '🗺️ Route shown' 
                                                                    : '🔍 Click to show route'}
                                                            </div>
                                                            {loadingRoute && selectedParticipantId === participant._id && (
                                                                <div className="text-xs text-primary-teal">
                                                                    Loading...
                                                                </div>
                                                            )}
                                                            {selectedParticipantId === participant._id && !loadingRoute && (
                                                                <div style={{ 
                                                                    width: '8px',
                                                                    height: '8px',
                                                                    backgroundColor: 'var(--primary-teal)',
                                                                    borderRadius: '50%',
                                                                    marginLeft: 'var(--spacing-2)'
                                                                }} />
                                                            )}
                                                        </>
                                                    ) : (
                                                        <div className="text-xs text-neutral-400">
                                                            {!journey || !journey.destination 
                                                                ? '📍 No destination set' 
                                                                : '⏳ Waiting for location'}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                                
                                {/* Destination Management for Group Leaders */}
                                {isGroupLeader() && (
                                    <div className="card" style={{ 
                                        marginBottom: 'var(--spacing-6)',
                                        border: '2px solid var(--success-200)',
                                        backgroundColor: 'var(--success-50)'
                                    }}>
                                        <h4 className="text-sm font-medium text-success-700" style={{ 
                                            marginBottom: 'var(--spacing-3)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 'var(--spacing-1)'
                                        }}>
                                            🎯 Destination Management
                                        </h4>
                                        {journey?.destination && (
                                            <div style={{
                                                fontSize: 'var(--font-size-xs)',
                                                color: 'var(--neutral-600)',
                                                marginBottom: 'var(--spacing-3)',
                                                padding: 'var(--spacing-2)',
                                                backgroundColor: 'var(--neutral-100)',
                                                borderRadius: 'var(--radius-md)',
                                                border: '1px solid var(--neutral-200)'
                                            }}>
                                                Current: {journey.destination.coordinates[1].toFixed(4)}, {journey.destination.coordinates[0].toFixed(4)}
                                            </div>
                                        )}
                                        <p className="text-xs text-neutral-600" style={{ marginBottom: 'var(--spacing-2)' }}>
                                            Click on map or search to update destination
                                        </p>
                                        <DestinationSearch 
                                            onDestinationSelect={handleDestinationSelect}
                                            currentLocation={currentLocation}
                                        />
                                    </div>
                                )}
                                
                                <h4 className="text-sm font-medium text-neutral-700" style={{ marginBottom: 'var(--spacing-3)' }}>
                                    Live Location Updates
                                </h4>
                                <div>
                                    {Object.entries(locationUpdates).map(([userId, update]) => (
                                        <div key={`location-${userId}`} style={{ 
                                            padding: 'var(--spacing-2)', 
                                            margin: '0 0 var(--spacing-2) 0', 
                                            backgroundColor: 'var(--primary-50)',
                                            borderRadius: 'var(--radius-md)',
                                            border: '1px solid var(--primary-200)'
                                        }}>
                                            <div className="text-xs font-medium text-neutral-800" style={{ marginBottom: 'var(--spacing-1)' }}>
                                                {update.username}
                                            </div>
                                            <div className="text-xs text-neutral-600">
                                                {update.latitude.toFixed(4)}, {update.longitude.toFixed(4)}
                                            </div>
                                            <div className="text-xs text-neutral-400">
                                                {new Date(update.timestamp).toLocaleTimeString()}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
