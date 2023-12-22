const Loan = require('../models/Loan');
const Account = require('../models/User');
const User = require('../models/User');

// Create a new loan request
exports.createLoanRequest = async (req, res) => {
  try {
    const { userId, loanAmount, loanTermMonths, loanPurpose, interestRate } = req.body;

    // Check if the user exists
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create a new loan request
    const loanRequest = new Loan({
      userId,
      loanAmount,
      loanTerm: loanTermMonths,
      loanPurpose,
      interestRate,
    });

    // Save the loan request
    await loanRequest.save();

    res.status(201).json({ message: 'Loan request created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};

// Get loan requests by user ID
exports.getLoanRequestsByUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Check if the user exists
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Retrieve loan requests for the user
    const loanRequests = await Loan.find({ userId });

    if (!loanRequests) {
      return res.status(404).json({ message: 'No loan requests found for this user' });
    }

    res.status(200).json({ loanRequests });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
