import React, { useState, useEffect, useRef } from 'react';
import journeyService from '../services/journeyService';
import socketService from '../services/socketService';
import mapService from '../services/mapService';
import Map from '../components/Map';
import DestinationSearch from '../components/DestinationSearch';
import Header from '../components/Header';

const Dashboard = () => {
    const [journey, setJourney] = useState(null);
    const [code, setCode] = useState('');
    const [currentLocation, setCurrentLocation] = useState(null);
    const [locationError, setLocationError] = useState('');
    const [participants, setParticipants] = useState([]);
    const [locationUpdates, setLocationUpdates] = useState({});
    const [travelTimes, setTravelTimes] = useState({});
    const [isConnected, setIsConnected] = useState(false);
    const [destination, setDestination] = useState(null);
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
                    setLocationError('Unable to get your location. Using default location.');
                    // Fallback to default location (NYC)
                    setCurrentLocation({ lat: 40.730610, lng: -73.935242 });
                }
            );
        } else {
            setLocationError('Geolocation is not supported by this browser.');
            setCurrentLocation({ lat: 40.730610, lng: -73.935242 });
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
                socketService.sendMessage(journey.code, 'destination_updated', {
                    destination: destinationData,
                    updatedBy: JSON.parse(localStorage.getItem('user')).username
                });
            } catch (error) {
                console.error('Failed to update destination:', error);
                alert('Failed to update destination. Please try again.');
            }
        }
    };

    const getUserRole = () => {
        if (!journey || !participants.length) return null;
        const currentUser = JSON.parse(localStorage.getItem('user'));
        const participant = participants.find(p => p._id === currentUser.id);
        return participant?.role;
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
            setJourney(data);
            
            // Connect to socket and start sharing location
            connectToSocket();
            setTimeout(() => {
                socketService.joinJourney(data.code);
                startLocationSharing(data.code);
            }, 1000);
        } catch (error) {
            console.error('Failed to join journey', error);
        }
    };

    const mapCenter = currentLocation || { lat: 40.730610, lng: -73.935242 };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
            <Header />
            <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
                <h2 style={{ marginBottom: '20px', color: '#333' }}>Dashboard</h2>
                {locationError && <p style={{ color: 'orange', backgroundColor: '#fff3cd', padding: '10px', borderRadius: '5px' }}>{locationError}</p>}
                
                {!journey ? (
                    <div style={{
                        backgroundColor: 'white',
                        padding: '30px',
                        borderRadius: '10px',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                        textAlign: 'center'
                    }}>
                        <h3 style={{ marginBottom: '20px', color: '#333' }}>Start Your Journey</h3>
                        <p style={{ marginBottom: '20px', color: '#666' }}>
                            Current Location: {currentLocation ? `${currentLocation.lat.toFixed(4)}, ${currentLocation.lng.toFixed(4)}` : 'Loading...'}
                        </p>
                        
                        {/* Destination Selection */}
                        <div style={{ marginBottom: '20px', textAlign: 'left' }}>
                            <h4 style={{ marginBottom: '10px', color: '#333' }}>🎯 Select Destination</h4>
                            <p style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>
                                Search for a location or click anywhere on the map to set your destination
                            </p>
                            <DestinationSearch 
                                onDestinationSelect={handleDestinationSelect}
                                currentLocation={currentLocation}
                            />
                            {destination && (
                                <div style={{
                                    backgroundColor: '#e8f5e8',
                                    padding: '10px',
                                    borderRadius: '6px',
                                    marginTop: '10px',
                                    border: '1px solid #28a745'
                                }}>
                                    <div style={{ fontSize: '14px', color: '#28a745', fontWeight: 'bold' }}>
                                        ✅ Destination Selected
                                    </div>
                                    <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>
                                        📍 {destination.lat.toFixed(4)}, {destination.lng.toFixed(4)}
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        <div style={{ marginBottom: '30px' }}>
                            <button 
                                onClick={handleCreateJourney} 
                                disabled={!currentLocation || !destination}
                                style={{
                                    backgroundColor: (!currentLocation || !destination) ? '#ccc' : '#28a745',
                                    color: 'white',
                                    padding: '15px 30px',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    cursor: (!currentLocation || !destination) ? 'not-allowed' : 'pointer',
                                    marginBottom: '20px',
                                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                                }}
                            >
                                🚀 Create New Journey {!destination && '(Select destination first)'}
                            </button>
                        </div>
                        
                        <div style={{ 
                            borderTop: '1px solid #eee', 
                            paddingTop: '20px',
                            marginTop: '20px'
                        }}>
                            <h4 style={{ marginBottom: '15px', color: '#333' }}>Or Join an Existing Journey</h4>
                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center' }}>
                                <input
                                    type="text"
                                    placeholder="Enter Journey Code"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    style={{
                                        padding: '12px',
                                        border: '2px solid #ddd',
                                        borderRadius: '8px',
                                        fontSize: '16px',
                                        width: '200px'
                                    }}
                                />
                                <button 
                                    onClick={handleJoinJourney}
                                    disabled={!code.trim()}
                                    style={{
                                        backgroundColor: !code.trim() ? '#ccc' : '#007bff',
                                        color: 'white',
                                        padding: '12px 20px',
                                        border: 'none',
                                        borderRadius: '8px',
                                        fontSize: '16px',
                                        fontWeight: 'bold',
                                        cursor: !code.trim() ? 'not-allowed' : 'pointer'
                                    }}
                                >
                                    Join Journey
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '10px',
                        overflow: 'hidden',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                    }}>
                        <div style={{ 
                            backgroundColor: '#667eea', 
                            color: 'white', 
                            padding: '20px',
                            textAlign: 'center'
                        }}>
                            <h3 style={{ margin: '0 0 10px 0' }}>Journey: {journey.code}</h3>
                            <p style={{ margin: 0, opacity: '0.9' }}>Share this code with others to join your journey!</p>
                            <p style={{ margin: '10px 0 0 0', fontSize: '14px' }}>
                                Connection Status: {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
                            </p>
                        </div>
                        
                        <div style={{ display: 'flex', gap: '0' }}>
                            <div style={{ flex: 2, padding: '20px' }}>
                                <Map 
                                    center={mapCenter} 
                                    zoom={15} 
                                    participants={participants}
                                    locationUpdates={locationUpdates}
                                    currentLocation={currentLocation}
                                    destination={journey?.destination ? {
                                        lat: journey.destination.coordinates[1],
                                        lng: journey.destination.coordinates[0]
                                    } : destination}
                                    isLeader={isGroupLeader()}
                                    onDestinationSelect={handleDestinationSelect}
                                    showRoute={journey && currentLocation && (journey.destination || destination)}
                                />
                            </div>
                            
                            <div style={{ 
                                flex: 1, 
                                padding: '20px',
                                backgroundColor: '#f8f9fa',
                                borderLeft: '1px solid #ddd',
                                maxHeight: '500px', 
                                overflowY: 'auto'
                            }}>
                                <h4 style={{ margin: '0 0 15px 0', color: '#333' }}>
                                    Participants ({participants.length})
                                </h4>
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                    {participants.map((participant) => (
                                        <li key={participant._id} style={{ 
                                            padding: '15px', 
                                            margin: '0 0 10px 0', 
                                            backgroundColor: 'white', 
                                            borderRadius: '8px',
                                            border: '1px solid #eee',
                                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                                                <strong style={{ color: '#333' }}>{participant.username}</strong>
                                                <span style={{ 
                                                    color: participant.role === 'Group Leader' ? '#e74c3c' : '#27ae60',
                                                    fontWeight: 'bold',
                                                    marginLeft: '8px',
                                                    fontSize: '18px'
                                                }}>
                                                    {participant.role === 'Group Leader' ? '👑' : '👤'}
                                                </span>
                                            </div>
                                            <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
                                                {participant.role}
                                            </div>
                                            
                                            {locationUpdates[participant._id] && (
                                                <div style={{ fontSize: '11px', color: '#888', marginBottom: '5px' }}>
                                                    Last update: {new Date(locationUpdates[participant._id].timestamp).toLocaleTimeString()}
                                                </div>
                                            )}
                                            
                                            {travelTimes[participant._id] && (
                                                <div style={{ 
                                                    fontSize: '11px', 
                                                    color: '#2c3e50',
                                                    backgroundColor: '#e8f4fd',
                                                    padding: '5px 8px',
                                                    borderRadius: '4px',
                                                    marginTop: '5px'
                                                }}>
                                                    🚗 ETA: {travelTimes[participant._id].duration.text}<br />
                                                    📍 Distance: {travelTimes[participant._id].distance.text}
                                                </div>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                                
                                {/* Destination Management for Group Leaders */}
                                {isGroupLeader() && (
                                    <div style={{ 
                                        marginBottom: '20px',
                                        padding: '15px',
                                        backgroundColor: 'white',
                                        borderRadius: '8px',
                                        border: '2px solid #28a745',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                    }}>
                                        <h4 style={{ margin: '0 0 10px 0', color: '#28a745', fontSize: '14px' }}>
                                            🎯 Destination Management
                                        </h4>
                                        {journey?.destination && (
                                            <div style={{
                                                fontSize: '12px',
                                                color: '#666',
                                                marginBottom: '10px',
                                                padding: '8px',
                                                backgroundColor: '#f8f9fa',
                                                borderRadius: '4px'
                                            }}>
                                                Current: {journey.destination.coordinates[1].toFixed(4)}, {journey.destination.coordinates[0].toFixed(4)}
                                            </div>
                                        )}
                                        <div style={{ fontSize: '11px', color: '#666', marginBottom: '8px' }}>
                                            Click on map or search to update destination
                                        </div>
                                        <DestinationSearch 
                                            onDestinationSelect={handleDestinationSelect}
                                            currentLocation={currentLocation}
                                        />
                                    </div>
                                )}
                                
                                <h4 style={{ margin: '20px 0 10px 0', color: '#333', fontSize: '14px' }}>
                                    Live Location Updates
                                </h4>
                                <div style={{ fontSize: '11px' }}>
                                    {Object.entries(locationUpdates).map(([userId, update]) => (
                                        <div key={userId} style={{ 
                                            padding: '8px', 
                                            margin: '5px 0', 
                                            backgroundColor: '#e8f4fd',
                                            borderRadius: '4px',
                                            border: '1px solid #bee5eb'
                                        }}>
                                            <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>
                                                {update.username}
                                            </div>
                                            <div style={{ color: '#666' }}>
                                                {update.latitude.toFixed(4)}, {update.longitude.toFixed(4)}
                                            </div>
                                            <div style={{ color: '#888', fontSize: '10px' }}>
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
