const express = require('express');
const jwtProtection = require('../middleware/jwtProtection');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.put('/update/:_id', jwtProtection, userController.updateUser);
router.get('/:userId', jwtProtection, userController.getUser);

module.exports = router;
