const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.post('/', orderController.createOrder);
router.get('/', orderController.getAllOrders);
router.get('/:id', orderController.getOrderById);

router.post('/:orderId/blockchain-verify', orderController.verifyOrderOnBlockchain);
router.get('/:orderId/blockchain-verification', orderController.getBlockchainVerification);

module.exports = router;
