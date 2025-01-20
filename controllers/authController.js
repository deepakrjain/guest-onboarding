const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');
const bcrypt = require('bcryptjs');

exports.login = async (req, res) => {
    try {
        if (!req.body || !req.body.username || !req.body.password) {
            return res.render('admin/login', {
                error: 'Username and password are required.'
            });
        }

        const { username, password } = req.body;

        const admin = await Admin.findOne({ username }).populate('hotel');
        if (!admin) {
            return res.render('admin/login', {
                error: 'Invalid credentials',
                username
            });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.render('admin/login', {
                error: 'Invalid credentials',
                username
            });
        }

        const token = jwt.sign(
            { id: admin._id, role: admin.role, hotelId: admin.hotel?._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000
        });

        res.redirect(admin.role === 'mainAdmin' ? '/admin/dashboard' : '/admin/guest-dashboard');
    } catch (error) {
        console.error('Login error:', error);
        res.render('admin/login', {
            error: 'An error occurred during login. Please try again.'
        });
    }
};

exports.logout = (req, res) => {
    res.clearCookie('token');
    res.redirect('/admin/login');
};

exports.registerGuestAdmin = async (req, res) => {
    try {
        const { username, email, password, hotelId } = req.body;
        
        // Check if email already exists
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Create new guest admin
        const admin = new Admin({
            username,
            email,
            password, // Will be hashed by the model's pre-save middleware
            role: 'guestAdmin',
            hotel: hotelId
        });

        await admin.save();
        res.status(201).json({ message: 'Guest admin registered successfully' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Error registering guest admin' });
    }
};