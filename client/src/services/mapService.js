// Map service for distance and travel time calculation using OpenStreetMap data
class MapService {
    constructor() {
        this.openRouteServiceKey = null; // Optional: for more accurate routing
    }

    // Calculate straight-line distance between two points (Haversine formula)
    calculateStraightLineDistance(point1, point2) {
        const R = 6371; // Earth's radius in kilometers
        const dLat = this.toRadians(point2.lat - point1.lat);
        const dLng = this.toRadians(point2.lng - point1.lng);
        
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(this.toRadians(point1.lat)) * Math.cos(this.toRadians(point2.lat)) *
                Math.sin(dLng / 2) * Math.sin(dLng / 2);
        
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;
        
        return distance;
    }

    toRadians(degrees) {
        return degrees * (Math.PI / 180);
    }

    // Estimate travel time based on straight-line distance
    estimateTravelTime(distanceKm, transportMode = 'driving') {
        let averageSpeed; // km/h
        
        switch (transportMode) {
            case 'walking':
                averageSpeed = 5;
                break;
            case 'cycling':
                averageSpeed = 15;
                break;
            case 'driving':
                averageSpeed = 50; // Average city driving speed
                break;
            default:
                averageSpeed = 50;
        }
        
        // Add 20% buffer for actual road routing (not straight line)
        const adjustedDistance = distanceKm * 1.2;
        const timeInHours = adjustedDistance / averageSpeed;
        const timeInMinutes = Math.round(timeInHours * 60);
        
        return {
            distance: {
                text: `${distanceKm.toFixed(1)} km`,
                value: Math.round(distanceKm * 1000) // in meters
            },
            duration: {
                text: timeInMinutes < 60 ? `${timeInMinutes} mins` : `${Math.floor(timeInMinutes / 60)}h ${timeInMinutes % 60}m`,
                value: timeInMinutes * 60 // in seconds
            }
        };
    }

    // Use OpenRouteService API for more accurate routing (requires API key)
    async calculateTravelTimeWithRouting(origins, destinations, transportMode = 'driving-car') {
        // This is a placeholder for OpenRouteService integration
        // You can sign up for a free API key at openrouteservice.org
        
        if (!this.openRouteServiceKey) {
            // Fallback to straight-line calculation
            return this.calculateStraightLineDistance(origins[0], destinations[0]);
        }

        try {
            const response = await fetch('https://api.openrouteservice.org/v2/matrix/' + transportMode, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8',
                    'Authorization': this.openRouteServiceKey,
                    'Content-Type': 'application/json; charset=utf-8'
                },
                body: JSON.stringify({
                    locations: [
                        [origins[0].lng, origins[0].lat],
                        [destinations[0].lng, destinations[0].lat]
                    ],
                    sources: [0],
                    destinations: [1]
                })
            });

            const data = await response.json();
            
            if (data.distances && data.durations) {
                const distance = data.distances[0][1] / 1000; // Convert to km
                const duration = data.durations[0][1] / 60; // Convert to minutes
                
                return {
                    distance: {
                        text: `${distance.toFixed(1)} km`,
                        value: Math.round(distance * 1000)
                    },
                    duration: {
                        text: duration < 60 ? `${Math.round(duration)} mins` : `${Math.floor(duration / 60)}h ${Math.round(duration % 60)}m`,
                        value: Math.round(duration * 60)
                    }
                };
            }
        } catch (error) {
            console.warn('OpenRouteService API failed, falling back to straight-line calculation:', error);
        }

        // Fallback to straight-line calculation
        const distance = this.calculateStraightLineDistance(origins[0], destinations[0]);
        return this.estimateTravelTime(distance);
    }

    async getTravelTimeToDestination(currentLocation, destination) {
        try {
            const origins = [{ lat: currentLocation.lat, lng: currentLocation.lng }];
            const destinations = [{ lat: destination.lat, lng: destination.lng }];
            
            const result = await this.calculateTravelTimeWithRouting(origins, destinations);
            
            return {
                destinationIndex: 0,
                distance: result.distance,
                duration: result.duration,
                destination: destinations[0]
            };
        } catch (error) {
            console.error('Error calculating travel time:', error);
            return null;
        }
    }

    // Set OpenRouteService API key for more accurate routing (optional)
    setOpenRouteServiceKey(apiKey) {
        this.openRouteServiceKey = apiKey;
    }

    // Get route coordinates for path visualization using OpenRouteService
    async getRouteCoordinates(startPoint, endPoint, transportMode = 'driving-car') {
        // First try with OpenRouteService if API key is available
        if (this.openRouteServiceKey) {
            try {
                const response = await fetch(`https://api.openrouteservice.org/v2/directions/${transportMode}`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': this.openRouteServiceKey,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        coordinates: [
                            [startPoint.lng, startPoint.lat],
                            [endPoint.lng, endPoint.lat]
                        ],
                        format: 'geojson'
                    })
                });

                const data = await response.json();
                
                if (data.features && data.features[0] && data.features[0].geometry) {
                    // Convert coordinates to lat/lng format for Leaflet
                    return data.features[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
                }
            } catch (error) {
                console.warn('OpenRouteService routing failed, using fallback:', error);
            }
        }

        // Fallback: Use OSRM public API (free but limited)
        try {
            const response = await fetch(
                `https://router.project-osrm.org/route/v1/driving/${startPoint.lng},${startPoint.lat};${endPoint.lng},${endPoint.lat}?overview=full&geometries=geojson`
            );
            
            const data = await response.json();
            
            if (data.routes && data.routes[0] && data.routes[0].geometry) {
                // Convert coordinates to lat/lng format for Leaflet
                return data.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
            }
        } catch (error) {
            console.warn('OSRM routing failed, using straight line:', error);
        }

        // Final fallback: return simple straight line coordinates
        return [
            [startPoint.lat, startPoint.lng],
            [endPoint.lat, endPoint.lng]
        ];
    }

    // Get detailed route information including coordinates and travel time
    async getRouteDetails(startPoint, endPoint, transportMode = 'driving-car') {
        try {
            // Get route coordinates
            const coordinates = await this.getRouteCoordinates(startPoint, endPoint, transportMode);
            
            // Get travel time information
            const travelInfo = await this.getTravelTimeToDestination(startPoint, endPoint);
            
            return {
                coordinates,
                distance: travelInfo ? travelInfo.distance : null,
                duration: travelInfo ? travelInfo.duration : null,
                startPoint,
                endPoint
            };
        } catch (error) {
            console.error('Error getting route details:', error);
            return null;
        }
    }
}

export default new MapService();
