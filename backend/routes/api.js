// api.js
const express = require('express');
const jwtProtection = require('../middleware/jwtProtection');
const router = express.Router();

const userRoutes = require('./userRoutes');
const payeeRoutes = require('./payeeRoutes');
const transactionRoutes = require('./transactionRoutes');
const creditCardRoutes = require('./creditCardRoutes');
const loanRoutes = require('./loanRoutes');
const cardTransactionRoutes = require('./cardTransactionRoutes');

router.use('/users', userRoutes);
router.use('/payee', jwtProtection, payeeRoutes);
router.use('/transactions', jwtProtection, transactionRoutes);
router.use('/credit-cards', jwtProtection, creditCardRoutes);
router.use('/loans', jwtProtection, loanRoutes);
router.use('/card-transactions', jwtProtection, cardTransactionRoutes);

module.exports = router;
