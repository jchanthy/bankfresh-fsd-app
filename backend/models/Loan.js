const mongoose = require("mongoose");

const loanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  loanPurpose: { type: String, required: true },
  loanAmount: { type: Number, required: true },
  interestRate: { type: Number, required: true },
  loanTerm: { type: Number, required: true },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "approved",
  },
});

module.exports = Loan = mongoose.model("Loan", loanSchema);
