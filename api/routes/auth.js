const express = require('express');
const authController = require('../../controllers/auth');
const { protect } = require('../../middleware/auth');
const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/fish', protect, (req, res) => {
    res.send('This is a protected route, accessible only to authenticated users');
});

module.exports = router;