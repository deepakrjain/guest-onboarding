const Hotel = require('../models/hotel');
const Guest = require('../models/guest');
const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs');

// Main Admin Dashboard
exports.dashboard = async (req, res) => {
    try {
        const hotels = await Hotel.find();
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Get total number of guests
        const totalGuests = await Guest.countDocuments(); // Fetch total guest count

        // Get today's check-ins
        const todayCheckIns = await Guest.countDocuments({
            'stayDates.from': { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) },
        });

        // Fetch hotels with today's guests and total guests
        const hotelsWithStats = await Promise.all(
            hotels.map(async (hotel) => {
                const [hotelTodayGuests, hotelTotalGuests] = await Promise.all([
                    Guest.countDocuments({
                        hotel: hotel._id,
                        'stayDates.from': { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) },
                    }),
                    Guest.countDocuments({ hotel: hotel._id }),
                ]);

                return { ...hotel.toObject(), todayGuests: hotelTodayGuests, totalGuests: hotelTotalGuests };
            })
        );

        // Pass data to the view
        res.render('admin/dashboard', {
            pageTitle: 'Admin Dashboard',
            hotels: hotelsWithStats,  // Send the list of hotels with stats
            totalGuests,             // Send totalGuests count
            todayCheckIns,           // Send today's check-ins count
        });

    } catch (error) {
        console.error('Error loading dashboard:', error);
        res.status(500).render('index', {
            pageTitle: 'Error',
            message: 'An error occurred while loading the dashboard.',
        });
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

exports.addHotel = async (req, res) => {
    try {
        const { name, address } = req.body;
        const logo = req.file.filename; // Uploaded file's name

        // Create hotel and generate QR code
        const newHotel = await Hotel.create({ name, address, logo });
        const qrCode = await QRCode.toDataURL(`${req.protocol}://${req.get('host')}/guest/${newHotel._id}`);
        newHotel.qrCode = qrCode;
        await newHotel.save();

        res.redirect('/admin/hotels'); // Redirect to Manage Hotels page
    } catch (error) {
        console.error('Error adding hotel:', error.message);
        res.status(500).send('Error adding hotel');
    }
};

exports.getHotels = async (req, res) => {
    try {
        const hotels = await Hotel.find(); // Fetch all hotels from MongoDB
        res.render('admin/hotels', { hotels, error: null, user: req.user });
    } catch (error) {
        console.error('Error fetching hotels:', error.message);
        res.status(500).render('admin/hotels', { 
            hotels: [], 
            error: 'Failed to fetch hotels', 
            user: req.user 
        });
    }
};

exports.deleteHotel = async (req, res) => {
    try {
        const hotelId = req.params.id;

        // Find the hotel by ID
        const hotel = await Hotel.findById(hotelId);

        if (!hotel) {
            return res.status(404).json({ message: 'Hotel not found' });
        }

        // Delete associated files (e.g., logo)
        if (hotel.logo) {
            fs.unlink(`public/uploads/${hotel.logo}`, err => {
                if (err) console.error('Error deleting logo:', err);
            });
        }

        // Delete associated guests
        await Guest.deleteMany({ hotel: hotel._id });

        // Delete the hotel
        await Hotel.findByIdAndDelete(hotelId);

        // Redirect back to the hotel list
        res.redirect('/admin/hotels');
    } catch (error) {
        console.error('Error deleting hotel:', error);
        res.status(500).json({ message: 'Error deleting hotel' });
    }
};

exports.searchGuests = async (req, res) => {
    try {
        const { query } = req.query;
        const hotelId = req.user.role === 'mainAdmin' ? req.query.hotelId : req.user.hotelId;

        const searchCriteria = {
            hotel: hotelId,
            $or: [
                { fullName: new RegExp(query, 'i') },
                { email: new RegExp(query, 'i') },
                { mobileNumber: new RegExp(query, 'i') }
            ]
        };

        const guests = await Guest.find(searchCriteria).limit(10);
        
        res.json(guests);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error searching guests' });

    }
};

// Add this new function - don't replace entire file
exports.generateQRCode = async (req, res) => {
    try {
        const hotel = await Hotel.findById(req.params.hotelId);
        if (!hotel) {
            return res.status(404).json({ message: 'Hotel not found' });
        }

        const guestFormUrl = `${process.env.BASE_URL}/guest/${hotel._id}`;
        const qrCode = await QRCode.toDataURL(guestFormUrl);
        
        hotel.qrCode = qrCode;
        await hotel.save();

        res.json({ qrCode });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error generating QR code');
    }
};

// Guest Management
exports.getGuests = async (req, res) => {
    try {
        const guests = await Guest.find({ hotel: req.params.id });
        const hotel = await Hotel.findById(req.params.id);
        res.render('admin/guestDetails', { 
            guests,
            hotel,
            user: req.user
        });
    } catch (error) {
        console.error('Error fetching hotel guests:', error);
        res.redirect('/admin/hotels');
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