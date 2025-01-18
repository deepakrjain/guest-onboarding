const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken, isMainAdmin } = require('../middleware/authMiddleware');
const { login, logout } = require('../controllers/adminController');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const upload = multer({ dest: 'public/uploads/' });

router.post(
    '/add-hotel',
    [
        body('name').notEmpty().withMessage('Hotel name is required'),
        body('address').notEmpty().withMessage('Address is required'),
    ],
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
    adminController.addHotel
);

// Login route
router.get('/login', (req, res) => {
    res.render('admin/login');
});

router.post('/add-hotel', upload.single('logo'), adminController.addHotel);
router.get('/hotels', adminController.getHotels);
router.post('/add-hotel', adminController.addHotel);
router.get('/guest/:id', adminController.getGuests);
router.post('/guest/edit/:id', adminController.editGuest);
router.get('/guest/view/:id', adminController.viewGuest);

router.post('/login', login);
router.get('/logout', logout);

router.use(verifyToken); // Protect all routes below
router.get('/dashboard', isMainAdmin, adminController.dashboard);


module.exports = router;