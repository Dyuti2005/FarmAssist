const express = require('express');
const router = express.Router();
const cropController = require('../controllers/cropController');

router.get('/', cropController.getAllCrops);
router.post('/', cropController.createCrop);
router.get('/:id', cropController.getCropById);
router.put('/:id', cropController.updateCrop);

module.exports = router;
