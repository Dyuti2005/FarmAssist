const express = require('express');
const router = express.Router();
const { verifyToken, requireRole } = require('../middleware/authMiddleware');
const paymentController = require('../controllers/paymentController');

const authRoutes = require('./authRoutes');

// Unprotected routes
router.use('/auth', authRoutes);
router.post('/webhooks/razorpay', paymentController.handleWebhook);

const farmerRoutes = require('./farmerRoutes');
const cropRoutes = require('./cropRoutes');
const passportRoutes = require('./passportRoutes');
const productRoutes = require('./productRoutes');
const orderRoutes = require('./orderRoutes');

const digitalTwinRoutes = require('./digitalTwinRoutes');
const weatherRoutes = require('./weatherRoutes');
const aiRoutes = require('./aiRoutes');

const buyerRoutes = require('./buyerRoutes');
const marketplaceRoutes = require('./marketplaceRoutes');

// Protect all following routes
router.use(verifyToken);

// Farmer-only routes
router.use('/farmers', requireRole('FARMER'), farmerRoutes);
router.use('/crops', requireRole('FARMER'), cropRoutes);
router.use('/crop-passports', requireRole('FARMER'), passportRoutes);
router.use('/digital-twin', requireRole('FARMER'), digitalTwinRoutes);
router.use('/weather', requireRole('FARMER'), weatherRoutes);
router.use('/ai', requireRole('FARMER'), aiRoutes);

const farmerOrderRoutes = require('./farmerOrderRoutes');

router.use('/products', requireRole('FARMER'), productRoutes);
router.use('/farmer/orders', requireRole('FARMER'), farmerOrderRoutes);

const cartRoutes = require('./cartRoutes');
const paymentRoutes = require('./paymentRoutes');

router.use('/buyers', requireRole('BUYER'), buyerRoutes);
router.use('/marketplace', requireRole('BUYER'), marketplaceRoutes);
router.use('/orders', requireRole('BUYER'), orderRoutes);
router.use('/cart', requireRole('BUYER'), cartRoutes);
router.use('/payments', requireRole('BUYER'), paymentRoutes);

module.exports = router;
