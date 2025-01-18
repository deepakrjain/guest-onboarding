// middleware/validationMiddleware.js
const { body, validationResult } = require('express-validator');

exports.guestValidationRules = [
    body('fullName').notEmpty().trim().withMessage('Full name is required')
        .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
    body('mobile').notEmpty().withMessage('Mobile number is required')
        .matches(/^[0-9]{10}$/).withMessage('Please enter a valid 10-digit mobile number'),
    body('email').isEmail().withMessage('Please enter a valid email address'),
    body('purpose').isIn(['Business', 'Personal', 'Tourist']).withMessage('Invalid purpose selected'),
    body('address').notEmpty().withMessage('Address is required'),
    body('idProofNumber').notEmpty().withMessage('ID proof number is required')
];

exports.hotelValidationRules = [
    body('name').notEmpty().trim().withMessage('Hotel name is required')
        .isLength({ min: 2, max: 100 }).withMessage('Hotel name must be between 2 and 100 characters'),
    body('address').notEmpty().withMessage('Address is required')
];

exports.validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};