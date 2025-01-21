const jwt = require('jsonwebtoken');

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).render('admin/login', {
                error: 'Access Denied. Please log in.',
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('JWT Verification Error:', error);
        res.status(403).render('admin/login', {
            error: 'Invalid or expired token. Please log in again.',
        });
    }
};

// Middleware to check for MainAdmin role
const isMainAdmin = (req, res, next) => {
    if (req.user.role !== 'MainAdmin') {
        return res.status(403).json({ message: 'Access Denied. Admin privileges required.' });
    }
    next();
};

// Middleware to check for GuestAdmin role
const isGuestAdmin = (req, res, next) => {
    if (req.user.role !== 'GuestAdmin') {
        return res.status(403).json({ message: 'Access Denied. Guest Admin privileges required.' });
    }
    next();
};

module.exports = { verifyToken, isMainAdmin, isGuestAdmin };