const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.put('/update/:_id', userController.updateUser);
router.get('/:userId', userController.getUser);

module.exports = router;
