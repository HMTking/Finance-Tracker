const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  updateProfile
} = require('../controllers/authController');
const auth = require('../middleware/auth');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', auth, getMe);
router.put('/profile', auth, updateProfile);

module.exports = router;
