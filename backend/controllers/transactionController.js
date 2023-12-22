const Transaction = require('../models/Transaction');
const User = require('../models/User');

exports.createTransaction = async (req, res) => {
  try {
    const { userId, receiverUserId, amount, description, receiverName } = req.body;

    const account = await User.findById(userId);

    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    const userBalance = account.balance;

    if (Math.abs(amount) > userBalance) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // Update the balance using $inc with a negative amount to debit the account
    const updatedUser = await User.updateOne(
      { _id: userId },
      { $inc: { balance: -Math.abs(amount) } } // Use a negative amount to reduce the balance
    );

    if (updatedUser.nModified === 0) {
      // No documents were updated, which might indicate an issue
      return res.status(500).json({ message: 'Failed to update balance' });
    }

    const transaction = new Transaction({
      userId,
      receiverUserId,
      amount,
      description,
      receiverName,
    });

    await transaction.save();

    res.status(201).json({
      message: 'Transaction created successfully',
      userBalance: userBalance - Math.abs(amount), // Return the updated balance
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

exports.getTransactionsByAccount = async (req, res) => {
  try {
    const userId = req.params.userId;
    const transactions = await Transaction.find({ userId });

    res.json({ transactions });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Unable to fetch transactions' });
  }
};
