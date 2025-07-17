//adminRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const adminController = require('../controllers/adminController');
const { ensureAdminLoggedIn } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { hotelValidationRules, validate } = require('../middleware/validationMiddleware');

// Public routes (Admin Login/Logout)
router.get('/login', (req, res) => {
    if (req.session.user && req.session.user.role === 'admin') {
        return res.redirect('/admin/dashboard');
    }
    res.render('admin/login', { pageTitle: 'Admin Login', error: req.session.error || null });
    delete req.session.error;
});

router.post('/login', authController.login);

router.get('/logout', (req, res) => {
    req.session.success = 'You have been logged out successfully.';

    res.clearCookie('token'); // Clear JWT cookie (if any was set)
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            req.session.error = 'Failed to log out completely. Please try again.';
        }
        res.redirect('/admin/login');
    });
});

// Protected routes for Main Admin
router.use(ensureAdminLoggedIn);

// Admin Dashboard
router.get('/dashboard', adminController.dashboard);

// Hotel Management
router.get('/hotels', adminController.getHotels);
router.post('/add-hotel', upload, hotelValidationRules, validate, adminController.addHotel);
router.post('/hotels/:id/delete', adminController.deleteHotel);

// Guest Management for Main Admin
router.get('/hotels/:id/guests', adminController.getHotelGuests);
router.get('/guests/:id', adminController.viewGuestDetails);
router.get('/guests/:id/actions', adminController.guestActions);
router.post('/guests/:guestId/edit', adminController.editGuest);

module.exports = router;