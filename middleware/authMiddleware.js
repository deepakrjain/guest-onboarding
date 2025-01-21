const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    try {
        const token = req.cookies.token; // Read token from cookies
        if (!token) {
            return res.redirect('/admin/login'); // Redirect to login if no token
        }

        // Decode and verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || '1067');
        req.user = decoded; // Attach decoded token to `req.user` for downstream use

        next(); // Pass control to the next middleware/handler
    } catch (error) {
        console.error('Token verification error:', error.message);
        res.clearCookie('token'); // Clear invalid token
        res.redirect('/admin/login'); // Redirect if token is invalid
    }
};

module.exports = { verifyToken };