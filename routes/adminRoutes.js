const express = require('express');
const router = express.Router();
const generateQRCode = require('../utils/qrCode');
const Hotel = require('../models/hotel');
const adminController = require('../controllers/adminController');
const authController = require('../controllers/authController');
const { verifyToken, isMainAdmin, isGuestAdmin } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');
const { hotelValidationRules, validate } = require('../middleware/validationMiddleware');

// Auth routes
router.get('/login', (req, res) => res.render('admin/login'));
router.post('/login', authController.login);
router.get('/logout', authController.logout);

// Protected routes
router.use(verifyToken);

// Main admin routes
router.use('/hotels', isMainAdmin);
router.get('/hotels', adminController.getHotels);
router.post(
    '/hotels',
    upload.single('logo'),
    hotelValidationRules,
    validate,
    async (req, res) => {
        try {
            const { name, address } = req.body;
            const logo = req.file.filename;
            const qrCodeUrl = `${process.env.BASE_URL}/guest/form?hotelId=${name}`;
            const qrCode = await generateQRCode(qrCodeUrl);

            const hotel = new Hotel({ name, address, logo, qrCode });
            await hotel.save();

            res.redirect('/admin/dashboard');
        } catch (error) {
            console.error('Error adding hotel:', error);
            res.status(500).send('Internal Server Error');
        }
    }
);

router.get('/dashboard', isMainAdmin, adminController.dashboard);

// Guest admin routes
router.use('/guests', isGuestAdmin);
router.get('/guests', adminController.getGuests);
router.get('/guest/:id', adminController.viewGuest);
router.post('/guest/edit/:id', adminController.editGuest);
router.get('/guest-dashboard', isGuestAdmin, adminController.guestDashboard);

// Register guest admin (main admin only)
router.post('/register-guest-admin', isMainAdmin, authController.registerGuestAdmin);

module.exports = router;