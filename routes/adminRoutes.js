//adminRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const adminController = require('../controllers/adminController');
const { verifyToken } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public routes

router.get('/login', (req, res) => {
    res.render('admin/login', { error: null });
});
router.post('/login', authController.login);
router.get('/logout', authController.logout);

// Protected routes
router.use(verifyToken);
router.get('/dashboard', async (req, res) => {
    try {
        const hotels = []; // Replace with actual data fetching logic
        const guests = []; // Replace with actual data fetching logic
        const todayCheckIns = 0; // Replace with actual calculation

        res.render('admin/dashboard', {
            user: req.user, // User from the decoded token
            pageTitle: 'Admin Dashboard',
            hotels,
            guests,
            todayCheckIns
        });
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.redirect('/admin/login');
    }
});
router.get('/hotels', adminController.getHotels);
router.post('/add-hotel', upload.single('logo'), adminController.addHotel);
router.get('/hotels/:hotelId/guests', adminController.getGuests);

module.exports = router;