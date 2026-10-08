const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weatherController');

// All endpoints map implicitly underneath /api/weather
router.get('/', weatherController.getWeather);

module.exports = router;
