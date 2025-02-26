//adminRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const adminController = require('../controllers/adminController');
const guestController = require('../controllers/guestController');
const Hotel = require('../models/hotel');
const Guest = require('../models/guest');
const { verifyToken } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { ensureAdminLoggedIn } = require('../middleware/authMiddleware');

// Public routes
router.get('/login', (req, res) => {
    if (req.user) {
        return res.redirect('/admin/dashboard');
    }
    res.render('admin/login', { error: null });
});

router.post('/login', authController.login);
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
        }
        res.redirect('/admin/login'); // Redirect admins to admin login after logout
    });
});

// Protected routes
router.use(verifyToken);

router.get('/dashboard', async (req, res) => {
    try {
        // Fetch hotels from the database
        const hotels = await Hotel.find();

        // Get total number of guests
        const totalGuests = await Guest.countDocuments();

        // Get today's check-ins
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set time to start of the day
        const todayCheckIns = await Guest.countDocuments({
            'stayDates.from': { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) },
        });

        // Fetch recent guests (limit to 10)
        const recentGuests = await Guest.find()
            .sort({ createdAt: -1 }) // Sort by most recent
            .limit(10) // Limit to 10 guests
            .populate('hotel', 'name'); // Include hotel name in guest data

        // Pass the fetched data to the view
        res.render('admin/dashboard', {
            user: req.session.user, // User info from session
            pageTitle: 'Admin Dashboard',
            hotels,
            totalGuests,
            todayCheckIns,
            recentGuests, // Include recentGuests
        });
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.redirect('/admin/login');
    }
});


router.post('/hotels/:id/delete', adminController.deleteHotel);
router.get('/hotels/:id/guests', adminController.getHotelGuests);
router.get('/guests', adminController.getGuests);
router.get('/hotels', guestController.listHotels);
router.post('/add-hotel', upload, adminController.addHotel);

// Route to view guest details
router.get('/guests/:id', adminController.viewGuestDetails);

router.post('/admin/edit-guest/:guestId', guestController.editGuest);

// Route to handle actions on a guest
router.get('/guests/:id/actions', adminController.guestActions);

module.exports = router;