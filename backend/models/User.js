const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String },
  address: { type: String },
  gender: { type: String },
  dob: { type: Date },
  password: { type: String, required: true },
  balance: { type: Number },
  securityQuestion: {
    type: String,
    // required: true,
  },
  securityAnswer: {
    type: String,
    // required: true,
  },
  cardNumber: { type: Number, required: true, default: 0 },
});

module.exports = User = mongoose.model("user", userSchema);
