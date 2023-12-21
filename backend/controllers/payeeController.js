// controllers/payeeController.js
const Payee = require("../models/Payee");

// Controller function to add a new payee
exports.addPayee = async (req, res) => {
  try {
    const { userId, bankName, ifscCode, accountNo, accountType, payeeName } =
      req.body;

    // Check if a payee with the same bank, account number, and user already exists
    const existingPayee = await Payee.findOne({ userId, bankName, accountNo });

    if (existingPayee) {
      return res.status(400).json({
        error:
          "Payee with the same bank, account number, and user already exists",
      });
    }

    // Create a new Payee document
    const payee = new Payee({
      userId,
      bankName,
      ifscCode,
      accountNo,
      accountType,
      payeeName,
    });

    // Save the Payee to the database
    await payee.save();

    res.status(201).json(payee);
  } catch (err) {
    console.error("Error adding payee:", err);
    res.status(500).json({ error: "Unable to add payee" });
  }
};

exports.getPayeesByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;

    const payees = await Payee.find({ userId });

    res.status(200).json(payees);
  } catch (err) {
    console.error("Error fetching payees:", err);
    res.status(500).json({ error: "Unable to fetch payees" });
  }
};
