const mongoose = require("mongoose");

const creditCardSchema = new mongoose.Schema({
  cardNumber: { type: String, required: true },
  cardHolderName: { type: String, required: true },
  expirationDate: { type: String, required: true },
  cvv: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  cardLimit: { type: Number, required: true },
  availableCredit: { type: Number, required: true },
  block: { type: Boolean, default: false },
  transactionLimit: {
    type: Number,
    default: function () {
      return this.cardLimit;
    },
  },
});

module.exports = CreditCard = mongoose.model("CreditCard", creditCardSchema);
