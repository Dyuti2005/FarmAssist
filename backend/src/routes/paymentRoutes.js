const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

router.get('/order/:orderId', paymentController.getPaymentStatus);
router.post('/order/:orderId/create', paymentController.createPayment);
router.post('/verify', paymentController.verifyPayment);

module.exports = router;
