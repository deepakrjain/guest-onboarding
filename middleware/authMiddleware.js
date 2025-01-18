const jwt = require('jsonwebtoken');

// Middleware to verify JWT
exports.verifyToken = (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Access Denied. Please log in.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(403).json({ message: 'Invalid or expired token.' });
    }
};

// Middleware to check for MainAdmin role
exports.isMainAdmin = (req, res, next) => {
    if (req.user.role !== 'MainAdmin') {
        return res.status(403).json({ message: 'Access Denied. Admin privileges required.' });
    }
    next();
};

// Middleware to check for GuestAdmin role
exports.isGuestAdmin = (req, res, next) => {
    if (req.user.role !== 'GuestAdmin') {
        return res.status(403).json({ message: 'Access Denied. Guest Admin privileges required.' });
    }
    next();
};