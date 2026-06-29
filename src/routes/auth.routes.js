const express = require('express');
const router  = express.Router();
const {
  register, adminRegister, login, getMe, updateProfile, changePassword,
} = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth');

router.post('/register',         register);
router.post('/admin-register',   adminRegister);
router.post('/login',            login);
router.get('/me',                protect, getMe);
router.put('/profile',           protect, updateProfile);
router.put('/change-password',   protect, changePassword);

module.exports = router;
