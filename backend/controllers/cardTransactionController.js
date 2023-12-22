const CreditCard = require('../models/CreditCard');
const CardTransaction = require('../models/cardTransaction');

// Create a credit card transaction
// exports.createTransaction = async (req, res) => {
//   try {
//     const { cardId, receiverUserId, receiverName, amount, description } =
//       req.body;

//     console.log(req.body);

//     // Validate the credit card ID and transaction amount
//     if (!cardId || !amount || amount <= 0) {
//       console.log("in credit card response  found section");

//       return res
//         .status(400)
//         .json({ error: "Invalid credit card or transaction amount." });
//     }

//     // Fetch the credit card details
//     const creditCard = await CreditCard.findById(cardId);

//     if (!creditCard) {
//       console.log("in credit card not found section");
//       return res.status(404).json({ error: "Credit card not found." });
//     }

//     // Check if the available balance is sufficient
//     if (amount > creditCard.availableCredit) {
//       console.log("available credit is ", creditCard.availableCredit);
//       return res.status(400).json({ error: "Insufficient balance." });
//     }

//     // Create a new card transaction
//     const newTransaction = new CardTransaction({
//       cardId,
//       receiverUserId,
//       receiverName,
//       amount,
//       description,
//     });

//     // Deduct the amount from the available balance
//     creditCard.availableCredit -= amount;
//     await creditCard.save();

//     // Save the transaction
//     await newTransaction.save();

//     return res
//       .status(201)
//       .json({ message: "Credit card transaction created successfully." });
//   } catch (error) {
//     console.error("Error creating credit card transaction:", error);
//     return res.status(500).json({ error: "Internal server error." });
//   }
// };

exports.createTransaction = async (req, res) => {
  try {
    const { cardId, receiverUserId, receiverName, amount, description } = req.body;

    // Validate the credit card ID and transaction amount
    if (!cardId || !amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid credit card or transaction amount.' });
    }

    // Fetch the credit card details
    const creditCard = await CreditCard.findById(cardId);

    if (!creditCard) {
      return res.status(404).json({ error: 'Credit card not found.' });
    }

    // Check if the credit card is blocked
    if (creditCard.block) {
      return res.status(400).json({
        error: 'Credit card is blocked. Cannot create a transaction.',
      });
    }

    // Check if the amount exceeds the transaction limit
    if (amount > creditCard.transactionLimit) {
      return res.status(400).json({
        error: 'Transaction amount exceeds the transaction limit.',
      });
    }

    // Check if the available balance is sufficient
    if (amount > creditCard.availableCredit) {
      return res.status(400).json({ error: 'Insufficient balance.' });
    }

    // Create a new card transaction
    const newTransaction = new CardTransaction({
      cardId,
      receiverUserId,
      receiverName,
      amount,
      description,
    });

    // Deduct the amount from the available balance
    creditCard.availableCredit -= amount;
    await creditCard.save();

    // Save the transaction
    await newTransaction.save();

    return res.status(201).json({ message: 'Credit card transaction created successfully.' });
  } catch (error) {
    console.error('Error creating credit card transaction:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

exports.getTransactionsByCardId = async (req, res) => {
  try {
    const cardId = req.params.cardId;

    // Find all transactions associated with the given card ID
    const transactions = await CardTransaction.find({ cardId });

    return res.status(200).json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};
