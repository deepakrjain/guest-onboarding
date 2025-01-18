const Hotel = require('../models/hotel');
const QRCode = require('qrcode');
const Admin = require('../models/admin');
const jwt = require('jsonwebtoken');

// Admin Login
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const admin = await Admin.findOne({ email });
        if (!admin || admin.password !== password) {
            return res.status(401).send('Invalid credentials');
        }

        const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.cookie('authToken', token, { httpOnly: true });
        res.redirect(admin.role === 'mainAdmin' ? '/admin/dashboard' : '/guest/dashboard');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

// Admin Logout
exports.logout = (req, res) => {
    res.clearCookie('authToken');
    res.redirect('/admin/login');
};

// Add a new hotel
exports.addHotel = async (req, res) => {
    try {
        const { name, address } = req.body;
        const logo = req.file ? req.file.filename : null;

        // Create a new hotel entry
        const hotel = new Hotel({ name, address, logo });
        await hotel.save();

        // Generate QR Code
        const qrCodeUrl = await QRCode.toDataURL(`${req.protocol}://${req.get('host')}/guest/${hotel._id}`);
        hotel.qrCodeUrl = qrCodeUrl;
        await hotel.save();

        res.redirect('/admin/dashboard');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

// Display all hotels
const QRCode = require('qrcode');

exports.getGuests = async (req, res) => {
    const hotelId = req.params.id;  // Assuming each hotel has a unique ID
    try {
        const guests = await Guest.find({ hotel: hotelId }); // Fetch guests of the specific hotel
        const hotel = await Hotel.findById(hotelId); // Get hotel details for the header
        res.render('admin/guestDetails', { guests, hotel });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.editGuest = async (req, res) => {
    const { fullName, mobile, purpose, fromDate, toDate, email } = req.body;
    const guestId = req.params.id;

    try {
        const updatedGuest = await Guest.findByIdAndUpdate(guestId, {
            fullName, mobile, purpose, fromDate, toDate, email
        }, { new: true });

        res.redirect(`/admin/guest/${updatedGuest.hotel}`); // Redirect back to the guest list for the specific hotel
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.viewGuest = async (req, res) => {
    const guestId = req.params.id;
    try {
        const guest = await Guest.findById(guestId); // Find guest by ID
        res.render('admin/viewGuest', { guest }); // Render viewGuest.ejs with guest data
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.getHotels = async (req, res) => {
    try {
        const hotels = await Hotel.find();
        for (const hotel of hotels) {
            hotel.qrCode = await QRCode.toDataURL(`/guest/form/${hotel._id}`);
        }
        res.render('admin/dashboard', { hotels });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};