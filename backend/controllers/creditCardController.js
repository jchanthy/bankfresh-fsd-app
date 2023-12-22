const CreditCard = require('../models/CreditCard');
const User = require('../models/User');

// Function to generate a random credit card number
function generateRandomCreditCardNumber() {
  const prefix = '4'; // Visa card prefix
  const randomNumber = Math.floor(100000000000000 + Math.random() * 900000000000000); // Generate a 15-digit random number
  return prefix + randomNumber.toString().slice(0, 15); // Ensure it's 16 digits
}

// Function to generate a random expiration date in MM/YYYY format
function generateRandomExpirationDate() {
  const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0'); // Random month (01-12)
  const year = String(new Date().getFullYear() + Math.floor(Math.random() * 10)); // Random year (current year + 0 to 9)
  return `${month}/${year}`;
}

// Function to generate a random CVV (3 digits)
function generateRandomCVV() {
  return String(Math.floor(100 + Math.random() * 900)); // Random 3-digit number
}

// Create a new credit card
exports.createCreditCard = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the user already has 3 cards
    if (user.cardNumber >= 3) {
      return res.status(400).json({ message: 'User already has the maximum number of cards (3).' });
    }

    const cardHolderName = user.fullName;

    // Generate random credit card details
    const cardNumber = generateRandomCreditCardNumber();
    const expirationDate = generateRandomExpirationDate();
    const cvv = generateRandomCVV();
    const cardLimit = 200000;

    // Create a new credit card
    const creditCard = new CreditCard({
      cardNumber,
      cardHolderName,
      expirationDate,
      cvv,
      userId,
      cardLimit,
      availableCredit: cardLimit,
    });

    // Save the credit card
    await creditCard.save();

    // Increase the user's cardNumber
    user.cardNumber += 1;
    await user.save();

    res.status(201).json({ message: 'Credit card created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get credit card details by account ID
exports.getCreditCardsByAccount = async (req, res) => {
  try {
    const { userId } = req.params;
    const creditCards = await CreditCard.find({ userId });

    if (!creditCards || creditCards.length === 0) {
      return res.status(404).json({ message: 'No credit cards found for this user' });
    }

    res.status(200).json({ creditCards });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.toggleCreditCardBlock = async (req, res) => {
  try {
    const { cardId } = req.params; // Assuming the cardId is passed in the URL parameters

    // Find the credit card by its ID
    const creditCard = await CreditCard.findById(cardId);

    if (!creditCard) {
      return res.status(404).json({ message: 'Credit card not found' });
    }

    // Toggle the 'block' field
    creditCard.block = !creditCard.block;

    // Save the updated credit card
    await creditCard.save();

    // Respond with a success message
    res.status(200).json({
      message: `Credit card block status toggled to ${creditCard.block ? 'blocked' : 'unblocked'}`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.updateTransactionLimit = async (req, res) => {
  try {
    const { cardId } = req.params;
    const { transactionLimit } = req.body;

    // Find the credit card by ID
    const creditCard = await CreditCard.findById(cardId);

    if (!creditCard) {
      return res.status(404).json({ error: 'Credit card not found.' });
    }

    // Update the transaction limit
    creditCard.transactionLimit = transactionLimit;

    // Save the updated credit card
    await creditCard.save();

    return res.status(200).json({ message: 'Transaction limit updated successfully.' });
  } catch (error) {
    console.error('Error updating transaction limit:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};
