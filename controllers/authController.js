const User = require('../models/admin');  // we're still importing from admin.js but it points to 'users' collection
const jwt = require('jsonwebtoken');
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log('Login attempt:', { username, password });

        const user = await User.findOne({ username: username });
        console.log('Found user:', user);

        if (!user) {
            console.log('No user found with username:', username);
            return res.render('admin/login', {
                error: 'Invalid username or password'
            });
        }

        if (user.password !== password) {
            console.log('Password mismatch');
            return res.render('admin/login', {
                error: 'Invalid username or password'
            });
        }

        // Create session
        req.session.user = {
            id: user._id,
            username: user.username,
            role: user.role
        };

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, username: user.username, role: user.role },
            process.env.JWT_SECRET || '1067',
            { expiresIn: '1h' } // Token expiration time
        );

        // Set token as a cookie
        res.cookie('token', token, { httpOnly: true });

        console.log('Login successful, redirecting to dashboard');
        res.redirect('/admin/dashboard');
    } catch (error) {
        console.error('Login error:', error);
        res.render('admin/login', {
            error: 'An error occurred during login'
        });
    }
};

exports.logout = (req, res) => {
    res.clearCookie('token');
    res.redirect('/admin/login');
};