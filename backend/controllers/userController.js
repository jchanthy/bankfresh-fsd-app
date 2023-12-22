const jwt = require('jsonwebtoken'); // Import JWT library
const bcrypt = require('bcrypt');
const User = require('../models/User'); // Import your User model here
const CreditCard = require('../models/CreditCard'); // Import your CreditCard model here

// Function to generate a random credit card number (you can implement this)
function generateRandomCreditCardNumber() {
  const prefix = '4'; // Visa card prefix
  const randomNumber = Math.floor(100000000000000 + Math.random() * 900000000000000); // Generate a 15-digit random number
  return prefix + randomNumber.toString().slice(0, 15); // Ensure it's 16 digits
}

// Function to generate a random expiration date (you can implement this)
function generateRandomExpirationDate() {
  const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0'); // Random month (01-12)
  const year = String(new Date().getFullYear() + Math.floor(Math.random() * 10)); // Random year (current year + 0 to 9)
  return `${month}/${year}`;
}

// Function to generate a random CVV (you can implement this)
function generateRandomCVV() {
  return String(Math.floor(100 + Math.random() * 900)); // Random 3-digit number
}

exports.registerUser = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, address, gender, dob, balance, password, securityQuestion, securityAnswer } = req.body;

    // Check if the user already exists with the provided email
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Hash the user's password and security answer
    const hashedPassword = await bcrypt.hash(password, 10);
    const hashedSecurityAnswer = await bcrypt.hash(securityAnswer, 10);

    // Create a new user
    const user = new User({
      fullName,
      email,
      phoneNumber,
      address,
      gender,
      dob,
      balance,
      password: hashedPassword,
      securityQuestion,
      securityAnswer: hashedSecurityAnswer,
    });

    // Save the user to the database
    await user.save();

    // Generate random credit card details and create a new credit card
    const cardNumber = generateRandomCreditCardNumber();
    const expirationDate = generateRandomExpirationDate();
    const cvv = generateRandomCVV();
    const cardLimit = 200000;

    const creditCard = new CreditCard({
      cardNumber,
      cardHolderName: fullName,
      expirationDate,
      cvv,
      userId: user._id,
      cardLimit,
      availableCredit: cardLimit,
    });

    await creditCard.save();

    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password, securityQuestion, securityAnswer } = req.body;
    // Check if the user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare the provided security answer with the stored hashed security answer
    const isSecurityAnswerValid = await bcrypt.compare(securityAnswer, user.securityAnswer);

    if (!isSecurityAnswerValid) {
      return res.status(401).json({ message: 'Invalid security answer' });
    }

    // Generate a JWT token with user data in the payload
    const token = jwt.sign(
      {
        _id: user._id,
        email: user.email,
        fullName: user.fullName,
      },
      process.env.JWT_SECRET
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        email: user.email,
        fullName: user.fullName,
        phoneNumber: user.phoneNumber,
        address: user.address,
        gender: user.gender,
        dob: user.dob,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { _id } = req.params;
    const { password, ...body } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const updatedUserData = { ...body, password: hashedPassword };

    // Find the user by ID and update their information
    const updatedUser = await User.findByIdAndUpdate(_id, updatedUserData, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User updated successfully', user: body });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Send the user's balance as the response
    res.status(200).json({ balance: user.balance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
