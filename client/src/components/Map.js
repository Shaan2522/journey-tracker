import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Create custom default marker icon
let DefaultIcon = L.divIcon({
    className: 'default-marker',
    html: `<div style="background-color: #3388ff; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 0 1px rgba(0,0,0,0.3);"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8]
});

L.Marker.prototype.options.icon = DefaultIcon;

const Map = ({ 
    center, 
    zoom, 
    participants = [], 
    locationUpdates = {}, 
    currentLocation, 
    destination = null,
    isLeader = false,
    onDestinationSelect = null,
    showRoute = false,
    routeCoordinates = null,
    selectedParticipantId = null
}) => {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markersRef = useRef({});
    const currentLocationMarkerRef = useRef(null);
    const destinationMarkerRef = useRef(null);
    const mainRouteLayerRef = useRef(null); // For main user route
    const participantRouteLayerRef = useRef(null); // For participant route

    // Function to fetch route coordinates using OSRM
    const fetchRouteCoordinates = async (start, end) => {
        try {
            console.log(`🚗 Fetching route from ${start.lat},${start.lng} to ${end.lat},${end.lng}`);
            
            // Validate input coordinates
            if (!start?.lat || !start?.lng || !end?.lat || !end?.lng) {
                throw new Error('Invalid coordinates provided');
            }
            
            const response = await fetch(
                `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    // Add timeout to avoid hanging requests
                    signal: AbortSignal.timeout(10000) // 10 second timeout
                }
            );
            
            if (!response.ok) {
                throw new Error(`OSRM API error: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log('📍 OSRM response received:', data);
            
            if (data.routes && data.routes[0] && data.routes[0].geometry && data.routes[0].geometry.coordinates) {
                // Convert coordinates to lat/lng format for Leaflet
                const coords = data.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
                console.log(`✅ Route found with ${coords.length} coordinate points`);
                return coords;
            } else {
                console.warn('⚠️  No valid route found in OSRM response');
                throw new Error('No route found in response');
            }
        } catch (error) {
            console.warn('❌ OSRM routing failed:', error.message);
            
            // More detailed error logging
            if (error.name === 'AbortError') {
                console.warn('🕐 Request timed out');
            } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
                console.warn('🌐 Network error or CORS issue');
            }
        }

        // Fallback: return simple straight line coordinates
        console.log('🔄 Using fallback straight line route');
        return [
            [start.lat, start.lng],
            [end.lat, end.lng]
        ];
    };

    // Initialize map
    useEffect(() => {
        // Add small delay to ensure DOM is ready
        const initMap = setTimeout(() => {
            if (!mapInstanceRef.current && mapRef.current) {
                try {
                    mapInstanceRef.current = L.map(mapRef.current, {
                        preferCanvas: true,
                        zoomControl: true,
                        attributionControl: true
                    }).setView([center.lat, center.lng], zoom);
                    
                    // Add OpenStreetMap tiles
                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                        maxZoom: 19
                    }).addTo(mapInstanceRef.current);

                    // Add click handler for destination selection (only for leaders)
                    if (isLeader && onDestinationSelect) {
                        mapInstanceRef.current.on('click', (e) => {
                            const { lat, lng } = e.latlng;
                            onDestinationSelect({ lat, lng });
                        });
                    }
                } catch (error) {
                    console.error('Error initializing map:', error);
                }
            }
        }, 100);

        // Cleanup on unmount
        return () => {
            clearTimeout(initMap);
            if (mapInstanceRef.current) {
                try {
                    mapInstanceRef.current.remove();
                } catch (error) {
                    console.error('Error cleaning up map:', error);
                } finally {
                    mapInstanceRef.current = null;
                    currentLocationMarkerRef.current = null;
                    destinationMarkerRef.current = null;
                    mainRouteLayerRef.current = null;
                    participantRouteLayerRef.current = null;
                    markersRef.current = {};
                }
            }
        };
    }, [center.lat, center.lng, zoom, isLeader, onDestinationSelect]);

    // Update map center and zoom when props change
    useEffect(() => {
        if (mapInstanceRef.current && center && center.lat && center.lng) {
            try {
                mapInstanceRef.current.setView([center.lat, center.lng], zoom);
            } catch (error) {
                console.error('Error updating map view:', error);
            }
        }
    }, [center, zoom]);

    // Update current location marker
    useEffect(() => {
        if (mapInstanceRef.current && currentLocation) {
            try {
                if (currentLocationMarkerRef.current) {
                    currentLocationMarkerRef.current.setLatLng([currentLocation.lat, currentLocation.lng]);
                } else {
                    const currentIcon = L.divIcon({
                        className: 'current-location-marker',
                        html: `<div style="background-color: #007bff; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 0 2px rgba(0,123,255,0.5);"></div>`,
                        iconSize: [22, 22],
                        iconAnchor: [11, 11]
                    });

                    currentLocationMarkerRef.current = L.marker([currentLocation.lat, currentLocation.lng], {
                        icon: currentIcon
                    }).addTo(mapInstanceRef.current)
                      .bindPopup('Your Location');
                }
                
                // Center map on current location
                mapInstanceRef.current.setView([currentLocation.lat, currentLocation.lng], zoom);
            } catch (error) {
                console.error('Error updating current location marker:', error);
            }
        }
    }, [currentLocation, zoom]);

    // Update participant markers
    useEffect(() => {
        if (mapInstanceRef.current && participants.length > 0) {
            try {
                // Clear existing markers
                Object.values(markersRef.current).forEach(marker => {
                    if (mapInstanceRef.current) {
                        mapInstanceRef.current.removeLayer(marker);
                    }
                });
                markersRef.current = {};

                participants.forEach(participant => {
                    const locationData = locationUpdates[participant._id];
                    
                    if (locationData && locationData.latitude && locationData.longitude) {
                        const isLeader = participant.role === 'Group Leader';
                        
                        const participantIcon = L.divIcon({
                            className: 'participant-marker',
                            html: `<div style="background-color: ${isLeader ? '#dc3545' : '#28a745'}; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 0 1px rgba(0,0,0,0.3);"></div>`,
                            iconSize: [18, 18],
                            iconAnchor: [9, 9]
                        });

                        const marker = L.marker([locationData.latitude, locationData.longitude], {
                            icon: participantIcon
                        }).addTo(mapInstanceRef.current);

                        // Add popup
                        const popupContent = `
                            <div style="text-align: center;">
                                <strong>${participant.username}</strong><br/>
                                <em style="color: ${isLeader ? '#dc3545' : '#28a745'};">${participant.role}</em><br/>
                                <small>Last update: ${new Date(locationData.timestamp).toLocaleTimeString()}</small>
                            </div>
                        `;

                        marker.bindPopup(popupContent);
                        markersRef.current[participant._id] = marker;
                    }
                });
            } catch (error) {
                console.error('Error updating participant markers:', error);
            }
        }
    }, [participants, locationUpdates]);

    // Update destination marker
    useEffect(() => {
        if (mapInstanceRef.current) {
            try {
                // Remove existing destination marker
                if (destinationMarkerRef.current) {
                    mapInstanceRef.current.removeLayer(destinationMarkerRef.current);
                    destinationMarkerRef.current = null;
                }

                // Add destination marker if destination exists
                if (destination && destination.lat && destination.lng) {
                    const destinationIcon = L.divIcon({
                        className: 'destination-marker',
                        html: `<div style="background-color: #ff6b35; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 0 2px rgba(255,107,53,0.5); position: relative;">
                            <div style="position: absolute; top: -8px; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 4px solid transparent; border-right: 4px solid transparent; border-bottom: 8px solid #ff6b35;"></div>
                        </div>`,
                        iconSize: [26, 34],
                        iconAnchor: [13, 26]
                    });

                    destinationMarkerRef.current = L.marker([destination.lat, destination.lng], {
                        icon: destinationIcon
                    }).addTo(mapInstanceRef.current)
                      .bindPopup('<div style="text-align: center;"><strong>🎯 Destination</strong><br/><small>Target location for the journey</small></div>');
                }
            } catch (error) {
                console.error('Error updating destination marker:', error);
            }
        }
    }, [destination]);

    // Update main route visualization (current user to destination)
    useEffect(() => {
        console.log('Route effect triggered:', { showRoute, currentLocation, destination });
        
        if (mapInstanceRef.current && showRoute && currentLocation && destination) {
            const displayRoute = async () => {
                try {
                    console.log('Displaying route from', currentLocation, 'to', destination);
                    
                    // Remove existing main route
                    if (mainRouteLayerRef.current) {
                        mapInstanceRef.current.removeLayer(mainRouteLayerRef.current);
                        mainRouteLayerRef.current = null;
                    }

                    // Validate coordinates
                    if (!currentLocation.lat || !currentLocation.lng || !destination.lat || !destination.lng) {
                        console.warn('Invalid coordinates for routing');
                        return;
                    }

                    // Fetch real route coordinates
                    const routeCoordinates = await fetchRouteCoordinates(currentLocation, destination);

                    // Create white outline first (background)
                    const outlineRoute = L.polyline(routeCoordinates, {
                        color: '#FFFFFF',
                        weight: 8,
                        opacity: 0.9,
                        lineCap: 'round',
                        lineJoin: 'round'
                    });

                    // Create main route on top
                    const mainRoute = L.polyline(routeCoordinates, {
                        color: '#4285F4', // Google Maps blue
                        weight: 5,
                        opacity: 1.0,
                        lineCap: 'round',
                        lineJoin: 'round'
                    }).bindPopup(`<div style="text-align: center; font-family: Inter, sans-serif;"><strong>🗺️ Your Route</strong><br/><small>Route to destination</small></div>`);

                    // Create a layer group with both outline and main route
                    mainRouteLayerRef.current = L.layerGroup([outlineRoute, mainRoute]).addTo(mapInstanceRef.current);

                    // Fit map to show the route with padding
                    const routeBounds = L.latLngBounds(routeCoordinates);
                    mapInstanceRef.current.fitBounds(routeBounds, { 
                        padding: [30, 30],
                        maxZoom: 16 
                    });

                } catch (error) {
                    console.error('Error displaying main route:', error);
                }
            };

            displayRoute();
        } else if (mainRouteLayerRef.current && mapInstanceRef.current) {
            console.log('Removing main route');
            try {
                // Remove main route if showRoute is false
                mapInstanceRef.current.removeLayer(mainRouteLayerRef.current);
                mainRouteLayerRef.current = null;
            } catch (error) {
                console.error('Error removing main route:', error);
            }
        }
    }, [currentLocation, destination, showRoute]);

    // Update participant route display
    useEffect(() => {
        if (mapInstanceRef.current && routeCoordinates && routeCoordinates.length > 0) {
            try {
                // Remove existing participant route if any
                if (participantRouteLayerRef.current) {
                    mapInstanceRef.current.removeLayer(participantRouteLayerRef.current);
                }

                // Find participant name for route tooltip
                const selectedParticipant = participants.find(p => p._id === selectedParticipantId);
                const participantName = selectedParticipant ? selectedParticipant.username : 'Participant';

                // Create participant route with different styling
                participantRouteLayerRef.current = L.polyline(routeCoordinates, {
                    color: '#14B8A6', // Teal color for participant route
                    weight: 4,
                    opacity: 0.9,
                    dashArray: '10, 10', // Dashed line to differentiate from main route
                    lineCap: 'round',
                    lineJoin: 'round'
                }).addTo(mapInstanceRef.current)
                .bindPopup(`<div style="text-align: center;"><strong>🗺️ ${participantName}'s Route</strong><br/><small>Route to destination</small></div>`);

                // Fit map to show the entire route
                const routeBounds = L.latLngBounds(routeCoordinates);
                mapInstanceRef.current.fitBounds(routeBounds, { 
                    padding: [20, 20],
                    maxZoom: 16 
                });

            } catch (error) {
                console.error('Error displaying participant route:', error);
            }
        } else if (participantRouteLayerRef.current && mapInstanceRef.current) {
            try {
                // Remove participant route if no coordinates provided
                mapInstanceRef.current.removeLayer(participantRouteLayerRef.current);
                participantRouteLayerRef.current = null;
            } catch (error) {
                console.error('Error removing participant route:', error);
            }
        }
    }, [routeCoordinates, selectedParticipantId, participants]);

    return (
        <div 
            ref={mapRef} 
            key={`map-${center.lat}-${center.lng}`}
            style={{ width: '100%', height: '500px', zIndex: 1 }} 
        />
    );
};

export default Map;
