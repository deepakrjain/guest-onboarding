//adminRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const adminController = require('../controllers/adminController');
const Hotel = require('../models/hotel');
const Guest = require('../models/guest');
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
router.get('/dashboard', verifyToken, async (req, res) => {
    try {
        // Fetch hotels from the database
        const hotels = await Hotel.find();

        // Get total number of guests
        const totalGuests = await Guest.countDocuments();

        // Get today's check-ins
        const today = new Date();
        today.setHours(0, 0, 0, 0);  // Set time to start of the day
        const todayCheckIns = await Guest.countDocuments({
            'stayDates.from': { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) }
        });

        // Get guest data for the dashboard
        const guests = await Guest.find().limit(10); // Example: fetching 10 guests (you can change the limit)

        // Pass the fetched data to the view
        res.render('admin/dashboard', {
            user: req.user,  // User info from token
            pageTitle: 'Admin Dashboard',
            hotels,
            guests,
            totalGuests,
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