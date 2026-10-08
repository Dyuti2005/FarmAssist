const express = require('express');
const router = express.Router();
const farmerController = require('../controllers/farmerController');

router.get('/me', farmerController.getFarmerProfile);
router.put('/me', farmerController.updateFarmerProfile);

module.exports = router;
