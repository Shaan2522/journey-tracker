const express = require('express');
const router = express.Router();
const {
    createJourney,
    joinJourney,
    updateDestination
} = require('../controllers/journeyController');
const {
    protect
} = require('../middleware/authMiddleware');

router.post('/', protect, createJourney);
router.get('/:code', protect, joinJourney);
router.put('/:journeyId/destination', protect, updateDestination);

module.exports = router;
