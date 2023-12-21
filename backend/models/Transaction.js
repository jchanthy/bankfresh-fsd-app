const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  receiverUserId: {
    type: String,
    // ref: "User",
    required: true,
  },
  receiverName: {
    type: String,
    require: true,
  },
  amount: { type: Number, required: true },
  description: { type: String },
  timestamp: { type: Date, default: Date.now },
  // Add other transaction-related fields as needed
});

module.exports = Transaction = mongoose.model("Transaction", transactionSchema);
