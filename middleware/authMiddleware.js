const jwt = require('jsonwebtoken');

// Define verifyToken as a const
const verifyToken = (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
        }
        next();
    } catch (error) {
        console.error('JWT Token verification error:', error.message);
        res.clearCookie('token');
        next();
    }
};

// Define ensureGuestLoggedIn as a const
const ensureGuestLoggedIn = (req, res, next) => {
    if (req.session.guest) {
        req.user = { id: req.session.guest.id, role: 'guestAdmin', hotelId: req.session.guest.hotelId };
        return next();
    }
    req.session.error = 'Please log in to access the Guest Admin Panel.';
    res.redirect('/guest/login');
};

// Define ensureAdminLoggedIn as a const
const ensureAdminLoggedIn = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'admin') {
        req.user = { id: req.session.user.id, role: req.session.user.role };
        return next();
    }
    req.session.error = 'Access denied. Admin privileges required.';
    res.redirect('/admin/login');
};

// Export all defined middleware functions
module.exports = { verifyToken, ensureGuestLoggedIn, ensureAdminLoggedIn };