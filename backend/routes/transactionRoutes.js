const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

// Route for creating a new transaction
router.post('/create', transactionController.createTransaction);

// Route for fetching transaction history by account ID
router.get('/:userId', transactionController.getTransactionsByAccount);

// Add more transaction-related routes as needed

module.exports = router;
