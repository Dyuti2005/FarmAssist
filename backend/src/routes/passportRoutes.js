const express = require('express');
const router = express.Router();
const passportController = require('../controllers/passportController');

router.get('/:id', passportController.getPassportById);
router.post('/:id/register', passportController.registerPassportOnChain);

module.exports = router;
