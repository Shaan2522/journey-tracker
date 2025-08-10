const mongoose = require('mongoose');

const LocationUpdateSchema = new mongoose.Schema({
    journeySession: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'JourneySession',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('LocationUpdate', LocationUpdateSchema);
