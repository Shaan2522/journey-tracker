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
    showRoute = false
}) => {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markersRef = useRef({});
    const currentLocationMarkerRef = useRef(null);
    const destinationMarkerRef = useRef(null);
    const routeLayerRef = useRef(null);

    // Initialize map
    useEffect(() => {
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

        // Cleanup on unmount
        return () => {
            if (mapInstanceRef.current) {
                try {
                    mapInstanceRef.current.remove();
                } catch (error) {
                    console.error('Error cleaning up map:', error);
                } finally {
                    mapInstanceRef.current = null;
                    currentLocationMarkerRef.current = null;
                    destinationMarkerRef.current = null;
                    routeLayerRef.current = null;
                    markersRef.current = {};
                }
            }
        };
    }, [isLeader, onDestinationSelect]);

    // Update map center and zoom when props change
    useEffect(() => {
        if (mapInstanceRef.current && center) {
            mapInstanceRef.current.setView([center.lat, center.lng], zoom);
        }
    }, [center, zoom]);

    // Update current location marker
    useEffect(() => {
        if (mapInstanceRef.current && currentLocation) {
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
        }
    }, [currentLocation, zoom]);

    // Update participant markers
    useEffect(() => {
        if (mapInstanceRef.current && participants.length > 0) {
            // Clear existing markers
            Object.values(markersRef.current).forEach(marker => {
                mapInstanceRef.current.removeLayer(marker);
            });
            markersRef.current = {};

            participants.forEach(participant => {
                const locationData = locationUpdates[participant._id];
                
                if (locationData) {
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
        }
    }, [participants, locationUpdates]);

    // Update destination marker
    useEffect(() => {
        if (mapInstanceRef.current) {
            // Remove existing destination marker
            if (destinationMarkerRef.current) {
                mapInstanceRef.current.removeLayer(destinationMarkerRef.current);
                destinationMarkerRef.current = null;
            }

            // Add destination marker if destination exists
            if (destination) {
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
        }
    }, [destination]);

    // Update route visualization
    useEffect(() => {
        if (mapInstanceRef.current && showRoute && currentLocation && destination) {
            // Remove existing route
            if (routeLayerRef.current) {
                mapInstanceRef.current.removeLayer(routeLayerRef.current);
                routeLayerRef.current = null;
            }

            // Create simple straight-line route (can be enhanced with actual routing)
            const routeCoordinates = [
                [currentLocation.lat, currentLocation.lng],
                [destination.lat, destination.lng]
            ];

            routeLayerRef.current = L.polyline(routeCoordinates, {
                color: '#007bff',
                weight: 4,
                opacity: 0.7,
                dashArray: '10, 10',
                lineCap: 'round',
                lineJoin: 'round'
            }).addTo(mapInstanceRef.current);

            // Fit map to show both current location and destination
            const group = new L.FeatureGroup([
                L.marker([currentLocation.lat, currentLocation.lng]),
                L.marker([destination.lat, destination.lng])
            ]);
            mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1));
        } else if (routeLayerRef.current && mapInstanceRef.current) {
            // Remove route if showRoute is false
            mapInstanceRef.current.removeLayer(routeLayerRef.current);
            routeLayerRef.current = null;
        }
    }, [currentLocation, destination, showRoute]);

    return <div ref={mapRef} style={{ width: '100%', height: '500px', zIndex: 1 }} />;
};

export default Map;
