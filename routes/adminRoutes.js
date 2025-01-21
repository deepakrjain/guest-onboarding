const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const adminController = require('../controllers/adminController');
const { verifyToken } = require('../middleware/authMiddleware');

// Public routes
router.get('/login', (req, res) => {
    res.render('admin/login', { error: null });
});
router.post('/login', authController.login);
router.get('/logout', authController.logout);

// Protected routes
router.use(verifyToken);
router.get('/dashboard', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/admin/login'); // Redirect to login if not authenticated
    }
    res.render('admin/dashboard', {
        user: req.session.user,
        pageTitle: 'Admin Dashboard'
    });
});

module.exports = router;