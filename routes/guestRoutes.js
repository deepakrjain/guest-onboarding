const express = require('express');
const router = express.Router();
const guestController = require('../controllers/guestController');
const { ensureGuestLoggedIn } = require('../middleware/authMiddleware');
const { guestValidationRules, validate } = require('../middleware/validationMiddleware');

// Public Guest Routes
router.get('/', guestController.showLogin);

router.get('/login', guestController.showLogin);
router.post('/login', guestController.login);

router.get('/signup', guestController.showSignup);
router.post('/signup', guestController.signup);

router.get('/hotels', guestController.listHotels);
router.get('/hotel/:id', guestController.hotelDetails);

router.get('/form/:hotelId', guestController.showForm);
router.post('/form/:hotelId', guestValidationRules, validate, guestController.submitForm);

router.get('/logout', (req, res) => {
    // --- CRITICAL CHANGE HERE ---
    // Set success message BEFORE destroying the session
    req.session.success = 'You have been logged out successfully.';

    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying guest session:', err);
            req.session.error = 'Failed to log out completely. Please try again.';
        }
        res.redirect('/guest/login');
    });
});

// Guest Admin Panel Routes (protected)
router.use(ensureGuestLoggedIn);

router.get('/admin/panel', guestController.showAdminPanel);
router.get('/admin/edit-guest/:guestId', guestController.getGuestDetails);
router.post('/admin/edit-guest/:guestId', guestController.editGuest);
router.get('/admin/view-guest/:guestId', guestController.viewGuestDetails);

module.exports = router;