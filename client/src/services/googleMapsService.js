// Google Maps service for distance and travel time calculation
class GoogleMapsService {
    constructor() {
        this.service = null;
    }

    initializeService() {
        if (window.google && window.google.maps && !this.service) {
            this.service = new window.google.maps.DistanceMatrixService();
        }
        return this.service;
    }

    calculateTravelTime(origins, destinations) {
        return new Promise((resolve, reject) => {
            const service = this.initializeService();
            
            if (!service) {
                reject(new Error('Google Maps service not available'));
                return;
            }

            service.getDistanceMatrix({
                origins: origins,
                destinations: destinations,
                travelMode: window.google.maps.TravelMode.DRIVING,
                unitSystem: window.google.maps.UnitSystem.METRIC,
                avoidHighways: false,
                avoidTolls: false
            }, (response, status) => {
                if (status === 'OK') {
                    const results = [];
                    const elements = response.rows[0].elements;
                    
                    elements.forEach((element, index) => {
                        if (element.status === 'OK') {
                            results.push({
                                destinationIndex: index,
                                distance: element.distance,
                                duration: element.duration,
                                destination: destinations[index]
                            });
                        }
                    });
                    
                    resolve(results);
                } else {
                    reject(new Error(`Distance Matrix request failed: ${status}`));
                }
            });
        });
    }

    async getTravelTimeToDestination(currentLocation, destination) {
        try {
            const origins = [new window.google.maps.LatLng(currentLocation.lat, currentLocation.lng)];
            const destinations = [new window.google.maps.LatLng(destination.lat, destination.lng)];
            
            const results = await this.calculateTravelTime(origins, destinations);
            return results[0] || null;
        } catch (error) {
            console.error('Error calculating travel time:', error);
            return null;
        }
    }
}

export default new GoogleMapsService();
