// middleware/validationMiddleware.js
const { body, validationResult } = require('express-validator');

exports.guestValidationRules = [
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

exports.validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(err => err.msg);

        // Determine the template and page title dynamically
        const template = req.originalUrl.includes('guest') ? 'guest/form' : 'admin/hotels';
        const pageTitle = req.originalUrl.includes('guest') ? 'Guest Registration' : 'Manage Hotels';

        return res.render(template, {
            errors: errorMessages,
            formData: req.body,
            pageTitle,
        });
    }
    next();
};