const express = require('express');
const router = express.Router();
const { updateProfile } = require('../controllers/Update.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

// Protect the profile update route with authMiddleware
router.put('/update-profile', authMiddleware, updateProfile);

module.exports = router;
