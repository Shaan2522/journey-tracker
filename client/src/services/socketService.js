import { io } from 'socket.io-client';

class SocketService {
    constructor() {
        this.socket = null;
        this.connected = false;
    }

    connect(token) {
        if (this.connected) {
            return this.socket;
        }

        this.socket = io('http://localhost:5000', {
            auth: {
                token: token
            }
        });

        this.socket.on('connect', () => {
            this.connected = true;
            console.log('Connected to server');
        });

        this.socket.on('disconnect', () => {
            this.connected = false;
            console.log('Disconnected from server');
        });

        this.socket.on('connect_error', (error) => {
            console.error('Connection error:', error);
        });

        return this.socket;
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            this.connected = false;
        }
    }

    joinJourney(journeyCode) {
        if (this.socket) {
            this.socket.emit('join-journey', journeyCode);
        }
    }

    sendLocationUpdate(journeyCode, latitude, longitude) {
        if (this.socket) {
            this.socket.emit('location-update', {
                journeyCode,
                latitude,
                longitude
            });
        }
    }

    onLocationUpdate(callback) {
        if (this.socket) {
            this.socket.on('location-update', callback);
        }
    }

    onJourneyJoined(callback) {
        if (this.socket) {
            this.socket.on('journey-joined', callback);
        }
    }

    onUserJoined(callback) {
        if (this.socket) {
            this.socket.on('user-joined', callback);
        }
    }

    onUserLeft(callback) {
        if (this.socket) {
            this.socket.on('user-left', callback);
        }
    }

    onError(callback) {
        if (this.socket) {
            this.socket.on('error', callback);
        }
    }

    // Send custom messages
    sendMessage(journeyCode, messageType, data) {
        if (this.socket) {
            this.socket.emit('journey-message', {
                journeyCode,
                messageType,
                data
            });
        }
    }

    // Listen for custom messages
    onMessage(messageType, callback) {
        if (this.socket) {
            this.socket.on(`journey-message-${messageType}`, callback);
        }
    }

    // Remove event listeners
    removeListener(event, callback) {
        if (this.socket) {
            this.socket.off(event, callback);
        }
    }
}

export default new SocketService();
