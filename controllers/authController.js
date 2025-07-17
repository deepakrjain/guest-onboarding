const Admin = require('../models/admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log('Login attempt:', { username });

        // Find user in the database
        const user = await Admin.findOne({ username });

        if (!user) {
            console.log('No user found with username:', username);
            // Use req.session.error for consistent flash messages
            req.session.error = 'Invalid username or password.';
            return res.render('admin/login', {
                error: req.session.error // Pass to EJS
            });
        }

        // For debugging - remove in production
        console.log('Found user:', {
            username: user.username,
            role: user.role
        });

        // --- CRITICAL CHANGE HERE: Use bcrypt.compare() ---
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            console.log('Password mismatch for user:', username); // Improved log message
            // Use req.session.error for consistent flash messages
            req.session.error = 'Invalid username or password.';
            return res.render('admin/login', {
                error: req.session.error // Pass to EJS
            });
        }
        // --- END OF CRITICAL CHANGE ---

        // Create session
        req.session.user = {
            id: user._id,
            username: user.username,
            role: user.role
        };

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, username: user.username, role: user.role },
            process.env.JWT_SECRET, // Rely solely on environment variable
            { expiresIn: '1h' }
        );

        // Set token as a cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 3600000 // 1 hour in milliseconds
        });

        console.log('Login successful, redirecting to dashboard');
        req.session.success = 'Login successful! Welcome.'; // Add success flash message
        res.redirect('/admin/dashboard');
    } catch (error) {
        console.error('Login error:', error);
        req.session.error = 'An error occurred during login.'; // Use req.session.error
        res.render('admin/login', {
            error: req.session.error // Pass to EJS
        });
    }
};