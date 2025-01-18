const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken, isMainAdmin } = require('../middleware/authMiddleware');

// Login route
router.get('/login', (req, res) => {
    res.render('admin/login');
});
router.post('/login', adminController.login);

// Protected routes
router.get('/dashboard', adminController.getHotels);
router.post('/add-hotel', adminController.addHotel);
router.get('/guest/:id', adminController.getGuests);
router.post('/guest/edit/:id', adminController.editGuest);
router.get('/guest/view/:id', adminController.viewGuest);

// Logout route
router.get('/logout', verifyToken, adminController.logout);

module.exports = router;