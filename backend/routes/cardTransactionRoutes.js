const express = require('express');
const router = express.Router();
const cardTransactionController = require('../controllers/cardTransactionController');

// Route for creating a new transaction
router.post('/create', cardTransactionController.createTransaction);

// Route for fetching transaction history by account ID
router.get('/:cardId', cardTransactionController.getTransactionsByCardId);

// Add more transaction-related routes as needed

module.exports = router;
