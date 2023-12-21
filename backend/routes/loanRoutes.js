const express = require('express');
const router = express.Router();
const loanController = require('../controllers/loanController');

// Route for applying for a loan
router.post('/apply', loanController.createLoanRequest);
// Route for viewing loan details
router.get('/:userId', loanController.getLoanRequestsByUser);

// Add more loan-related routes as needed

module.exports = router;
