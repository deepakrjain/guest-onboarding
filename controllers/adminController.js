const Hotel = require('../models/hotel');
const Guest = require('../models/guest');
const QRCode = require('qrcode');

// Main Admin Dashboard
exports.dashboard = async (req, res) => {
    try {
        const hotels = await Hotel.find();
        const totalHotels = await Hotel.countDocuments();
        const totalGuests = await Guest.countDocuments();
        
        res.render('admin/dashboard', {
            hotels,
            stats: {
                totalHotels,
                totalGuests,
                recentActivity: await Guest.find().sort('-createdAt').limit(5)
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

// Guest Admin Dashboard
exports.guestDashboard = async (req, res) => {
    try {
        const hotelId = req.user.hotelId;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const [guests, todayCheckIns, todayCheckOuts, hotel] = await Promise.all([
            Guest.find({ hotel: hotelId }).sort('-createdAt').limit(10),
            Guest.countDocuments({
                hotel: hotelId,
                'stayDates.from': {
                    $gte: today,
                    $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
                }
            }),
            Guest.countDocuments({
                hotel: hotelId,
                'stayDates.to': {
                    $gte: today,
                    $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
                }
            }),
            Hotel.findById(hotelId)
        ]);

        res.render('admin/guest-dashboard', {
            guests,
            hotel,
            stats: {
                todayCheckIns,
                todayCheckOuts,
                totalGuests: await Guest.countDocuments({ hotel: hotelId })
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

// Add Hotel
exports.addHotel = async (req, res) => {
    try {
        const { name, address } = req.body;
        const logo = req.file ? `/uploads/${req.file.filename}` : null;

        const hotel = new Hotel({ name, address, logo });
        await hotel.save();

        // Generate QR Code
        const qrUrl = `${process.env.BASE_URL}/guest/${hotel._id}`;
        const qrCode = await QRCode.toDataURL(qrUrl);
        hotel.qrCode = qrCode;
        await hotel.save();

        res.redirect('/admin/hotels');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

// View Hotels
exports.getHotels = async (req, res) => {
    try {
        const hotels = await Hotel.find();
        res.render('admin/hotels', { hotels });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

// Guest Management
exports.getGuests = async (req, res) => {
    try {
        const hotelId = req.user.role === 'mainAdmin' ? req.params.hotelId : req.user.hotelId;
        const guests = await Guest.find({ hotel: hotelId }).sort('-createdAt');
        const hotel = await Hotel.findById(hotelId);
        
        res.render('admin/guestDetails', { guests, hotel });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

exports.viewGuest = async (req, res) => {
    try {
        const guest = await Guest.findById(req.params.id).populate('hotel');
        
        if (!guest) {
            return res.status(404).send('Guest not found');
        }

        // Check if user has access to this guest's information
        if (req.user.role === 'guestAdmin' && guest.hotel._id.toString() !== req.user.hotelId) {
            return res.status(403).send('Access denied');
        }

        res.render('admin/viewGuest', { guest });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

exports.editGuest = async (req, res) => {
    try {
        const { fullName, mobile, purpose, fromDate, toDate, email } = req.body;
        const guest = await Guest.findById(req.params.id);

        if (!guest) {
            return res.status(404).send('Guest not found');
        }

        // Check if user has access to edit this guest
        if (req.user.role === 'guestAdmin' && guest.hotel.toString() !== req.user.hotelId) {
            return res.status(403).send('Access denied');
        }

        guest.fullName = fullName;
        guest.mobile = mobile;
        guest.purpose = purpose;
        guest.stayDates = { from: fromDate, to: toDate };
        guest.email = email;

        await guest.save();
        res.redirect(`/admin/guests${req.user.role === 'mainAdmin' ? '/' + guest.hotel : ''}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};