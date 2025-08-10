const jwt = require('jsonwebtoken');
const User = require('../models/User');
const JourneySession = require('../models/JourneySession');
const LocationUpdate = require('../models/LocationUpdate');

const authenticateSocket = async (socket, next) => {
    try {
        const token = socket.handshake.auth.token;
        if (!token) {
            return next(new Error('No token provided'));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        
        if (!user) {
            return next(new Error('User not found'));
        }

        socket.user = user;
        next();
    } catch (error) {
        next(new Error('Authentication failed'));
    }
};

module.exports = (io) => {
    io.use(authenticateSocket);

    io.on('connection', (socket) => {
        console.log(`User ${socket.user.username} connected`);

        // Join journey room
        socket.on('join-journey', async (journeyCode) => {
            try {
                const journey = await JourneySession.findOne({ code: journeyCode })
                    .populate('leader', 'username role')
                    .populate('members', 'username role');
                
                if (!journey) {
                    socket.emit('error', 'Journey not found');
                    return;
                }

                // Join the room named after the journey code
                socket.join(journeyCode);
                socket.currentJourney = journeyCode;
                
                console.log(`User ${socket.user.username} joined journey ${journeyCode}`);
                
                // Send current participants to the user
                socket.emit('journey-joined', {
                    journey,
                    participants: [journey.leader, ...journey.members]
                });

                // Notify other participants
                socket.to(journeyCode).emit('user-joined', {
                    user: socket.user,
                    message: `${socket.user.username} joined the journey`
                });
                
            } catch (error) {
                console.error('Error joining journey:', error);
                socket.emit('error', 'Failed to join journey');
            }
        });

        // Handle location updates
        socket.on('location-update', async (data) => {
            try {
                const { journeyCode, latitude, longitude } = data;
                
                if (!socket.currentJourney || socket.currentJourney !== journeyCode) {
                    socket.emit('error', 'Not in this journey');
                    return;
                }

                const journey = await JourneySession.findOne({ code: journeyCode });
                if (!journey) {
                    socket.emit('error', 'Journey not found');
                    return;
                }

                // Save location update to database
                const locationUpdate = new LocationUpdate({
                    journeySession: journey._id,
                    user: socket.user._id,
                    location: {
                        type: 'Point',
                        coordinates: [longitude, latitude]
                    }
                });

                await locationUpdate.save();

                // Broadcast location update to all participants in the journey
                const updateData = {
                    userId: socket.user._id,
                    username: socket.user.username,
                    role: socket.user.role,
                    latitude,
                    longitude,
                    timestamp: new Date()
                };

                io.to(journeyCode).emit('location-update', updateData);
                console.log(`Location update from ${socket.user.username} in journey ${journeyCode}`);
                
            } catch (error) {
                console.error('Error handling location update:', error);
                socket.emit('error', 'Failed to update location');
            }
        });

        // Handle custom journey messages (like destination updates)
        socket.on('journey-message', async (data) => {
            try {
                const { journeyCode, messageType, data: messageData } = data;
                
                // Verify user is part of this journey
                if (socket.currentJourney !== journeyCode) {
                    socket.emit('error', 'Not authorized for this journey');
                    return;
                }

                // Emit to all users in the journey room
                io.to(journeyCode).emit(`journey-message-${messageType}`, messageData);
                console.log(`Message ${messageType} sent in journey ${journeyCode} by ${socket.user.username}`);
                
            } catch (error) {
                console.error('Error handling journey message:', error);
                socket.emit('error', 'Failed to send message');
            }
        });

        // Handle disconnect
        socket.on('disconnect', () => {
            console.log(`User ${socket.user.username} disconnected`);
            
            if (socket.currentJourney) {
                socket.to(socket.currentJourney).emit('user-left', {
                    user: socket.user,
                    message: `${socket.user.username} left the journey`
                });
            }
        });
    });
};
