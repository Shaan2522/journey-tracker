const JourneySession = require('../models/JourneySession');

const createJourney = async (req, res) => {
    const {
        destination
    } = req.body;
    const leader = req.user._id;

    try {
        const journey = await JourneySession.create({
            leader,
            destination
        });
        res.status(201).json(journey);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const joinJourney = async (req, res) => {
    const {
        code
    } = req.params;
    const userId = req.user._id;

    try {
        const journey = await JourneySession.findOne({
            code
        });

        if (!journey) {
            return res.status(404).json({
                message: 'Journey not found'
            });
        }

        // Add user to members if not already in the list
        if (!journey.members.includes(userId)) {
            journey.members.push(userId);
            await journey.save();
        }

        res.json(journey);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const updateDestination = async (req, res) => {
    const { journeyId } = req.params;
    const { destination } = req.body;
    const userId = req.user._id;

    try {
        const journey = await JourneySession.findById(journeyId);

        if (!journey) {
            return res.status(404).json({
                message: 'Journey not found'
            });
        }

        // Check if user is the group leader
        if (journey.leader.toString() !== userId.toString()) {
            return res.status(403).json({
                message: 'Only group leaders can update destination'
            });
        }

        journey.destination = destination;
        await journey.save();

        res.json(journey);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    createJourney,
    joinJourney,
    updateDestination
};
