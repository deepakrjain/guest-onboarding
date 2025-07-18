// middleware/validationMiddleware.js
const { body, validationResult } = require('express-validator');
const Hotel = require('../models/hotel');

exports.guestValidationRules = [
    // ... (your existing validation rules) ...
    body('fullName')
        .trim()
        .notEmpty().withMessage('Full name is required')
        .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),

    body('mobileNumber')
        .matches(/^[0-9]{10}$/).withMessage('Please enter a valid 10-digit mobile number'),

    body('address')
        .trim()
        .notEmpty().withMessage('Address is required')
        .isLength({ min: 5 }).withMessage('Address must be at least 5 characters long'),

    body('purpose')
        .isIn(['Business', 'Personal', 'Tourist']).withMessage('Invalid purpose selected'),

    body('stayDates.from')
        .isISO8601().withMessage('Invalid check-in date')
        .custom((value, { req }) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const fromDate = new Date(value);
            if (fromDate < today) {
                throw new Error('Check-in date cannot be in the past');
            }
            return true;
        }),

    body('stayDates.to')
        .isISO8601().withMessage('Invalid check-out date')
        .custom((value, { req }) => {
            const fromDate = new Date(req.body.stayDates.from);
            const toDate = new Date(value);
            if (toDate <= fromDate) {
                throw new Error('Check-out date must be after check-in date');
            }
            if (toDate > new Date(fromDate.getTime() + 30 * 24 * 60 * 60 * 1000)) {
                throw new Error('Stay cannot exceed 30 days');
            }
            return true;
        }),

    body('email')
        .trim()
        .isEmail().withMessage('Please enter a valid email address')
        .normalizeEmail(),

    body('idProofNumber')
        .trim()
        .notEmpty().withMessage('ID proof number is required')
        .isLength({ min: 5, max: 20 }).withMessage('ID proof number must be between 5 and 20 characters')
];

exports.hotelValidationRules = [
    body('name')
        .trim()
        .notEmpty().withMessage('Hotel name is required')
        .isLength({ min: 2, max: 100 }).withMessage('Hotel name must be between 2 and 100 characters'),

    body('address')
        .trim()
        .notEmpty().withMessage('Address is required')
        .isLength({ min: 5 }).withMessage('Address must be at least 5 characters long')
];

exports.validate = async (req, res, next) => { // <--- Make it async
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(err => err.msg);

        // Determine the template and page title dynamically
        let template;
        let pageTitle;
        let hotel = null; // Initialize hotel to null

        if (req.originalUrl.includes('/guest/form/')) {
            template = 'guest/registerForm'; // <--- CRITICAL CHANGE: Correct EJS template name
            pageTitle = 'Guest Registration';
            // Extract hotelId from URL and fetch hotel data
            const hotelId = req.params.hotelId;
            if (hotelId) {
                hotel = await Hotel.findById(hotelId); // <--- NEW: Fetch hotel data
            }
        } else {
            template = 'admin/hotels';
            pageTitle = 'Manage Hotels';
            // For admin/hotels, you might need to fetch hotels list if not already done
            // This depends on how admin/hotels route is structured.
            // For simplicity, we assume adminController.addHotel will handle fetching hotels if it renders.
        }

        return res.render(template, {
            errors: errorMessages,
            formData: req.body,
            pageTitle,
            hotel: hotel, // <--- NEW: Pass hotel data to guest/registerForm
            hotels: await Hotel.find() // Pass hotels for admin/hotels template if needed
        });
    }
    next();
};