const express = require('express');
const router = express.Router();
const buyerController = require('../controllers/buyerController');

router.get('/me', buyerController.getMe);
router.put('/me', buyerController.updateMe);

module.exports = router;
