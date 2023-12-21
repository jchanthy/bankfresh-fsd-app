const express = require('express');
const router = express.Router();
const creditCardController = require('../controllers/creditCardController');

// Route for applying for a new credit card
router.post('/apply', creditCardController.createCreditCard);

// Route for managing credit card accounts
router.get('/:userId', creditCardController.getCreditCardsByAccount);

// Route for toggling the block status of a credit card
router.put('/block/:cardId', creditCardController.toggleCreditCardBlock);

router.put('/update-transaction-limit/:cardId', creditCardController.updateTransactionLimit);

module.exports = router;
