// api.js
const express = require("express");
const router = express.Router();

const userRoutes = require("./userRoutes");
const payeeRoutes = require("./payeeRoutes");
const transactionRoutes = require("./transactionRoutes");
const creditCardRoutes = require("./creditCardRoutes");
const loanRoutes = require("./loanRoutes");
const cardTransactionRoutes = require("./cardTransactionRoutes");

router.use("/users", userRoutes);
router.use("/payee", payeeRoutes);
router.use("/transactions", transactionRoutes);
router.use("/credit-cards", creditCardRoutes);
router.use("/loans", loanRoutes);
router.use("/card-transactions", cardTransactionRoutes);

module.exports = router;
