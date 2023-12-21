const mongoose = require("mongoose");

const cardTransactionSchema = new mongoose.Schema({
  cardId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CreditCard",
    required: true,
  },

  receiverUserId: {
    type: String,
    required: true,
  },
  receiverName: {
    type: String,
    require: true,
  },
  amount: { type: Number, required: true },
  description: { type: String },
  timestamp: { type: Date, default: Date.now },
});

module.exports = cardTransaction = mongoose.model(
  "CardTransaction",
  cardTransactionSchema
);
