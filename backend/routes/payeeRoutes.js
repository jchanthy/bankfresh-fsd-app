// accountRoutes.js
const express = require('express');
const router = express.Router();
const payeeController = require('../controllers/payeeController');

// Create a new bank account for a user
router.post('/create', payeeController.addPayee);

// Perform a transaction (deposit or withdrawal) on a user's account
router.get('/:userId', payeeController.getPayeesByUserId);

module.exports = router;
