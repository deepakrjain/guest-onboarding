const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('../models/admin');
const jwt = require('jsonwebtoken');

// Admin Login
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find the admin
        const admin = await Admin.findOne({ username });
        if (!admin) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Compare passwords
        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: admin._id, username: admin.username, role: admin.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        // Set the token in cookies
        res.cookie('token', token, { httpOnly: true });
        res.redirect('/admin/dashboard');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

// Admin Logout
exports.logout = (req, res) => {
    res.clearCookie('token');
    res.redirect('/login');
};

const adminSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

// Hash password before saving
adminSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

module.exports = mongoose.model('Admin', adminSchema);