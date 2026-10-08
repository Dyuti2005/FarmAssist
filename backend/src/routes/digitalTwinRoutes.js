const express = require('express');
const router = express.Router();
const digitalTwinController = require('../controllers/digitalTwinController');
const intelligenceController = require('../controllers/intelligenceController');

router.get('/:cropId', digitalTwinController.getDigitalTwinByCropId);
router.get('/:cropId/insights', intelligenceController.getInsights);

module.exports = router;
