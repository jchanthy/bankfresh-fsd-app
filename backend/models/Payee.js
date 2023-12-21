const mongoose = require("mongoose");

const payeeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  bankName: {
    type: String,
    required: true,
  },
  accountNo: {
    type: String,
    required: true,
  },
  accountType: String,
  ifscCode: String,
  payeeName: {
    type: String,
    required: true,
  },
});

module.exports = Payee = mongoose.model("Payee", payeeSchema);
