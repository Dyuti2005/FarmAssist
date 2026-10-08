const express = require('express');
const router = express.Router();
const farmerOrderController = require('../controllers/farmerOrderController');

router.get('/', farmerOrderController.getFarmerOrders);
router.get('/:id', farmerOrderController.getFarmerOrderDetails);
router.put('/:id/status', farmerOrderController.updateFarmerOrderStatus);

const orderController = require('../controllers/orderController');
router.post('/:orderId/blockchain-verify', orderController.verifyOrderOnBlockchain);
router.get('/:orderId/blockchain-verification', orderController.getBlockchainVerification);
module.exports = router;
