const User = require('../models/admin');  // we're still importing from admin.js but it points to 'users' collection

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
        console.log('Session created:', req.session.user);

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