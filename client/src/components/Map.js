import React, { useEffect, useRef, useState } from 'react';
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
    const mapReadyRef = useRef(false); // Track when map is fully initialized
    const [isMapReady, setIsMapReady] = useState(false); // State for triggering effects when map is ready

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
                        attributionControl: false, // Hide default attribution for cleaner look
                        scrollWheelZoom: true,
                        doubleClickZoom: true,
                        touchZoom: true,
                        boxZoom: true,
                        keyboard: true,
                        dragging: true
                    }).setView([center.lat, center.lng], zoom);
                    console.log('✅ Map instance created successfully!');
                    
                    // Add Google-style tile layer with better appearance
                    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
                        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> | &copy; <a href="https://carto.com/attributions">CARTO</a>',
                        maxZoom: 20,
                        subdomains: 'abcd'
                    }).addTo(mapInstanceRef.current);

                    // Add custom zoom control with Google-style positioning
                    mapInstanceRef.current.zoomControl.setPosition('topright');
                    
                    // Set map as ready after a small delay to ensure everything is loaded
                    setTimeout(() => {
                        mapReadyRef.current = true;
                        setIsMapReady(true); // This will trigger dependent effects
                        console.log('✅ Map fully ready for markers and routes');
                    }, 100);

                    // Add Mumbai landmark marker if using default location (Mumbai)
                    if (center.lat === 19.0760 && center.lng === 72.8777) {
                        const mumbaiIcon = L.divIcon({
                            className: 'mumbai-landmark-marker',
                            html: `<div style="
                                background-color: #1A73E8; 
                                width: 28px; 
                                height: 28px; 
                                border-radius: 50% 50% 50% 0; 
                                border: 3px solid white; 
                                box-shadow: 0 3px 10px rgba(0,0,0,0.3);
                                position: relative;
                                transform: rotate(-45deg);
                                display: flex;
                                align-items: center;
                                justify-content: center;
                            ">
                                <div style="
                                    transform: rotate(45deg);
                                    color: white;
                                    font-size: 14px;
                                ">🏙️</div>
                            </div>`,
                            iconSize: [34, 34],
                            iconAnchor: [17, 30]
                        });

                        L.marker([19.0760, 72.8777], {
                            icon: mumbaiIcon
                        }).addTo(mapInstanceRef.current)
                          .bindPopup(`
                            <div style="
                                font-family: 'Google Sans', 'Roboto', sans-serif;
                                text-align: center;
                                padding: 12px;
                                min-width: 160px;
                            ">
                                <div style="
                                    font-weight: 500;
                                    font-size: 16px;
                                    color: #3c4043;
                                    margin-bottom: 6px;
                                ">Mumbai, India</div>
                                <div style="
                                    color: #5f6368;
                                    font-size: 12px;
                                    line-height: 1.4;
                                ">Default location for Journey Tracker<br/>
                                   Allow location access for real-time tracking</div>
                            </div>
                          `);
                    }

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
                    mapReadyRef.current = false;
                    setIsMapReady(false);
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
                        html: `
                            <div class="beam"></div>
                            <div class="dot"></div>
                        `,
                        iconSize: [24, 24],
                        iconAnchor: [12, 12]
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
                            html: `<div style="
                                background-color: ${isLeader ? '#EA4335' : '#34A853'}; 
                                width: 16px; 
                                height: 16px; 
                                border-radius: 50%; 
                                border: 3px solid white; 
                                box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                color: white;
                                font-size: 10px;
                                font-weight: bold;
                            ">${isLeader ? '👑' : '👤'}</div>`,
                            iconSize: [22, 22],
                            iconAnchor: [11, 11]
                        });

                        const marker = L.marker([locationData.latitude, locationData.longitude], {
                            icon: participantIcon
                        }).addTo(mapInstanceRef.current);

                        // Add popup with Google-style content
                        const popupContent = `
                            <div style="
                                font-family: 'Google Sans', 'Roboto', sans-serif;
                                text-align: center;
                                padding: 8px 12px;
                                min-width: 120px;
                            ">
                                <div style="
                                    font-weight: 500;
                                    font-size: 14px;
                                    color: #3c4043;
                                    margin-bottom: 4px;
                                ">${participant.username}</div>
                                <div style="
                                    color: ${isLeader ? '#EA4335' : '#34A853'};
                                    font-size: 12px;
                                    font-weight: 500;
                                    margin-bottom: 6px;
                                ">${participant.role}</div>
                                <div style="
                                    color: #5f6368;
                                    font-size: 11px;
                                ">Updated: ${new Date(locationData.timestamp).toLocaleTimeString()}</div>
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
        console.log('🎯 Destination effect triggered:', { 
            destination, 
            hasMapInstance: !!mapInstanceRef.current,
            mapReady: mapReadyRef.current,
            isMapReady
        });
        
        if (mapInstanceRef.current && mapReadyRef.current) {
            try {
                // Remove existing destination marker
                if (destinationMarkerRef.current) {
                    mapInstanceRef.current.removeLayer(destinationMarkerRef.current);
                    destinationMarkerRef.current = null;
                }

                // Add destination marker if destination exists
                if (destination && destination.lat && destination.lng) {
                    console.log('🎯 Adding destination marker at:', destination);
                    const destinationIcon = L.divIcon({
                        className: 'destination-marker',
                        html: `<svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M19 0C12.3726 0 7 5.37258 7 12C7 21.75 19 38 19 38S31 21.75 31 12C31 5.37258 25.6274 0 19 0Z" fill="#EA4335"/>
                                    <path d="M19 0C12.3726 0 7 5.37258 7 12C7 21.75 19 38 19 38S31 21.75 31 12C31 5.37258 25.6274 0 19 0Z" stroke="white" stroke-width="2"/>
                                    <circle cx="19" cy="12" r="5" fill="white"/>
                                </svg>`,
                        iconSize: [38, 38],
                        iconAnchor: [19, 38]
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
    }, [destination, isMapReady]);

    // Update main route visualization (current user to destination)
    useEffect(() => {
        console.log('🗺️ Route effect triggered:', { 
            showRoute, 
            hasCurrentLocation: !!currentLocation, 
            hasDestination: !!destination,
            mapInstance: !!mapInstanceRef.current,
            mapReady: mapReadyRef.current,
            isMapReady
        });
        
        if (mapInstanceRef.current && mapReadyRef.current && showRoute && currentLocation && destination) {
            const displayRoute = async () => {
                try {
                    console.log('🗺️ Displaying route from', currentLocation, 'to', destination);
                    
                    // Remove existing main route
                    if (mainRouteLayerRef.current) {
                        mapInstanceRef.current.removeLayer(mainRouteLayerRef.current);
                        mainRouteLayerRef.current = null;
                    }

                    // Validate coordinates
                    if (!currentLocation.lat || !currentLocation.lng || !destination.lat || !destination.lng) {
                        console.warn('⚠️ Invalid coordinates for routing');
                        return;
                    }

                    // Fetch real route coordinates
                    const routeCoordinates = await fetchRouteCoordinates(currentLocation, destination);

                    if (!routeCoordinates || routeCoordinates.length < 2) {
                        console.warn('⚠️ No valid route coordinates received');
                        return;
                    }

                    // Google Maps style route with multiple layers for depth
                    // 1. Shadow layer (darkest, widest)
                    const shadowRoute = L.polyline(routeCoordinates, {
                        color: '#000000',
                        weight: 12,
                        opacity: 0.15,
                        lineCap: 'round',
                        lineJoin: 'round',
                        offset: 2
                    });

                    // 2. Border layer (white outline)
                    const borderRoute = L.polyline(routeCoordinates, {
                        color: '#FFFFFF',
                        weight: 10,
                        opacity: 0.9,
                        lineCap: 'round',
                        lineJoin: 'round'
                    });

                    // 3. Main route layer (Google blue)
                    const mainRoute = L.polyline(routeCoordinates, {
                        color: '#1A73E8', // Google Maps blue
                        weight: 6,
                        opacity: 1.0,
                        lineCap: 'round',
                        lineJoin: 'round'
                    });

                    // 4. Animated overlay for movement indication
                    const animatedRoute = L.polyline(routeCoordinates, {
                        color: '#4285F4',
                        weight: 2,
                        opacity: 0.8,
                        lineCap: 'round',
                        lineJoin: 'round',
                        dashArray: '10, 15',
                        className: 'animated-route' // CSS animation
                    });

                    // Add popup to main route
                    mainRoute.bindPopup(`
                        <div style="
                            font-family: 'Google Sans', 'Roboto', sans-serif;
                            text-align: center;
                            padding: 8px;
                            min-width: 120px;
                        ">
                            <div style="
                                font-weight: 500;
                                font-size: 14px;
                                color: #3c4043;
                                margin-bottom: 4px;
                            ">🗺️ Your Route</div>
                            <div style="
                                color: #5f6368;
                                font-size: 12px;
                            ">Click for directions</div>
                        </div>
                    `);

                    // Create a layer group with all route layers
                    mainRouteLayerRef.current = L.layerGroup([
                        shadowRoute, 
                        borderRoute, 
                        mainRoute, 
                        animatedRoute
                    ]).addTo(mapInstanceRef.current);

                    // Fit map to show the route with proper padding
                    const routeBounds = L.latLngBounds(routeCoordinates);
                    mapInstanceRef.current.fitBounds(routeBounds, { 
                        padding: [40, 40],
                        maxZoom: 15 
                    });

                    console.log('✅ Route displayed successfully with', routeCoordinates.length, 'points');

                } catch (error) {
                    console.error('❌ Error displaying main route:', error);
                }
            };

            displayRoute();
        } else if (mainRouteLayerRef.current && mapInstanceRef.current) {
            console.log('🗺️ Removing main route');
            try {
                // Remove main route if showRoute is false
                mapInstanceRef.current.removeLayer(mainRouteLayerRef.current);
                mainRouteLayerRef.current = null;
            } catch (error) {
                console.error('❌ Error removing main route:', error);
            }
        }
    }, [currentLocation, destination, showRoute, isMapReady]);

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
            style={{ width: '100%', height: '100%', minHeight: '400px', zIndex: 1 }} 
        />
    );
};

export default Map;
