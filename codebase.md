# render.yaml
```
services:
  - type: web
    name: guest-onboarding-app
    env: node
    buildCommand: "npm install"
    startCommand: "node app.js"
    envVars:
      - key: NODE_ENV
        value: production
      - key: MONGODB_URI
        value: mongodb+srv://deepakrjain7:rogerthat@guest-onboarding-mongod.xk6md.mongodb.net/guest-onboarding-mongod?retryWrites=true&w=majority&appName=guest-onboarding-mongodb
      - key: JWT_SECRET
        value: 1067
    plan: free
    autoDeploy: true
```
# app.js

```js
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const app = express();
const connectDB = require('./config/db');

// Middleware and Static File Serving
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layout');

// Session Configuration
app.use(session({
    secret: '1067',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: process.env.NODE_ENV === 'production', // Secure in production
    }
}));

// Global Middleware
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    res.locals.error = null;
    res.locals.success = null;
    next();
});

app.use((req, res, next) => {
    if (req.session.guest) {
        res.locals.user = { id: req.session.guest.id, role: 'guestAdmin' };
    } else if (req.session.user) {
        res.locals.user = { id: req.session.user.id, role: 'admin' };
    } else {
        res.locals.user = null;
    }
    next();
});

// Routes
app.get('/', (req, res) => {
    res.render('index', { 
        pageTitle: 'Digital Guest Onboarding System',
        message: null 
    });
});
app.use('/guest', require('./routes/guestRoutes'));
app.use('/admin', require('./routes/adminRoutes'));

// Error Handling
app.use((err, req, res, next) => {
    console.error('Error:', err.message || err);
    res.status(err.status || 500).render('index', {
        pageTitle: 'Error',
        message: err.message || 'An unexpected error occurred.'
    });
});

// 404 Handler
app.use((req, res) => {
    res.status(404).render('index', {
        pageTitle: '404 Not Found',
        message: 'Page not found'
    });
});

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();

module.exports = app;
```

# code.docx

This is a binary file of the type: Word Document

# config\db.js

```js
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected successfully!');
    } catch (err) {
        console.error('MongoDB connection error:', err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
```

# controllers\adminController.js

```js
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
        const totalGuests = await Guest.countDocuments();

        // Get today's check-ins
        const todayCheckIns = await Guest.countDocuments({
            'stayDates.from': { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) }
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

        // Fetch recent guests (limit to 10)
        const recentGuests = await Guest.find()
            .sort({ createdAt: -1 }) // Sort by most recent
            .limit(10) // Limit to 10 guests
            .populate('hotel', 'name'); // Include hotel name in guest data

        // Pass data to the view
        res.render('admin/dashboard', {
            pageTitle: 'Admin Dashboard',
            hotels: hotelsWithStats,
            totalGuests,
            todayCheckIns,
            recentGuests, // Pass recent guests
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
        const { name, address, description } = req.body;

        // Handle file uploads
        const logo = req.files['logo'] ? req.files['logo'][0].filename : null;
        const photos = req.files['photos'] ? req.files['photos'].map(file => file.filename) : [];

        if (!logo || photos.length < 3) {
            return res.render('admin/hotels', { 
                error: 'Logo and at least 3 photos are required.', 
                hotels: await Hotel.find() 
            });
        }

        // Generate QR code for hotel
        const qrCodeUrl = `${process.env.BASE_URL}/guest/hotel/${name}`;
        const qrCode = await QRCode.toDataURL(qrCodeUrl);

        // Save hotel to the database
        const newHotel = new Hotel({ name, address, description, logo, photos, qrCode });
        await newHotel.save();

        res.redirect('/admin/hotels');
    } catch (error) {
        console.error('Error adding hotel:', error);
        res.status(500).render('admin/hotels', { 
            error: 'Failed to add hotel.', 
            hotels: await Hotel.find() 
        });
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

exports.getHotelGuests = async (req, res) => {
    try {
        const hotelId = req.params.id;
        const hotel = await Hotel.findById(hotelId);
        if (!hotel) {
            return res.status(404).render('admin/guestDetails', {
                error: 'Hotel not found'
            });
        }

        const guests = await Guest.find({ hotel: hotelId });

        res.render('admin/guestDetails', { 
            hotel, 
            guests, 
            user: req.user
        });
    } catch (error) {
        console.error('Error fetching hotel guests:', error);
        res.status(500).send('Internal Server Error');
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
            user: req.user,
        });
    } catch (error) {
        console.error('Error fetching hotel guests:', error);
        res.redirect('/admin/hotels');
    }
};

exports.viewGuestDetails = async (req, res) => {
    try {
        const guestId = req.params.id;

        // Fetch guest details
        const guest = await Guest.findById(guestId).populate('hotel');
        if (!guest) {
            return res.status(404).render('admin/guestDetails', {
                pageTitle: 'Guest Not Found',
                error: 'The requested guest does not exist.',
                guest: null
            });
        }

        // Render the guest details page
        res.render('admin/guestDetails', {
            pageTitle: `Details for ${guest.fullName}`,
            guest,
            error: null
        });
    } catch (err) {
        console.error('Error fetching guest details:', err.message);
        res.status(500).render('admin/guestDetails', {
            pageTitle: 'Error',
            error: 'An error occurred while fetching guest details.',
            guest: null
        });
    }
};

exports.guestActions = async (req, res) => {
    try {
        const guestId = req.params.id;

        // Fetch guest details
        const guest = await Guest.findById(guestId).populate('hotel');
        if (!guest) {
            return res.status(404).render('admin/editGuest', {
                pageTitle: 'Guest Not Found',
                error: 'The requested guest does not exist.',
                guest: null
            });
        }

        // Render the edit guest page
        res.render('admin/editGuest', {
            pageTitle: `Actions for ${guest.fullName}`,
            guest,
            error: null
        });
    } catch (err) {
        console.error('Error loading guest actions:', err.message);
        res.status(500).render('admin/editGuest', {
            pageTitle: 'Error',
            error: 'An error occurred while loading guest actions.',
            guest: null
        });
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
        const { fullName, mobileNumber, purpose, stayDates, email } = req.body;
        const guest = await Guest.findById(req.params.guestId);

        if (!guest) {
            return res.status(404).send('Guest not found');
        }

        // Ensure guest admin has access to edit only their hotel guests
        if (req.user.role === 'guestAdmin' && guest.hotel.toString() !== req.user.hotelId) {
            return res.status(403).send('Access denied');
        }

        guest.fullName = fullName;
        guest.mobileNumber = mobileNumber;
        guest.purpose = purpose;
        guest.stayDates = stayDates;
        guest.email = email;

        await guest.save();
        res.redirect(`/guest/admin/guests/${req.user.hotelId}`);
    } catch (error) {
        console.error('Error editing guest:', error);
        res.status(500).send('Internal Server Error');
    }
};
```

# controllers\authController.js

```js
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
```

# controllers\guestController.js

```js
const bcrypt = require('bcryptjs');
const Guest = require('../models/guest');
const Hotel = require('../models/hotel');
const { validationResult } = require('express-validator');

exports.showLogin = (req, res) => {
    res.render('guest/login', { error: null });
};

exports.hotelDetails = async (req, res) => {
    try {
        const hotel = await Hotel.findById(req.params.id);
        if (!hotel) {
            return res.status(404).render('guest/form', {
                pageTitle: 'Hotel Not Found',
                errors: [{ msg: 'The requested hotel does not exist.' }],
                hotels: [],
            });
        }

        res.render('guest/hotelDetails', {
            pageTitle: hotel.name,
            hotel,
        });
    } catch (error) {
        console.error('Error fetching hotel details:', error);
        res.status(500).render('guest/form', {
            pageTitle: 'Error',
            errors: [{ msg: 'An error occurred while fetching hotel details.' }],
            hotels: [],
        });
    }
};

exports.listHotels = async (req, res) => {
    try {
        const hotels = await Hotel.find(); // Fetch all hotels from the database

        // Check if there are any hotels available
        if (!hotels.length) {
            return res.status(404).render('guest/hotelList', {
                pageTitle: 'No Hotels Available',
                hotels: [], // Pass an empty array
                error: 'No hotels are available at the moment.', // Display error message
            });
        }

        // Render the hotelList.ejs view with the list of hotels
        res.render('guest/hotelList', {
            pageTitle: 'Available Hotels',
            hotels, // Pass the list of hotels
            error: null, // No errors
        });
    } catch (error) {
        console.error('Error fetching hotels:', error);

        // Handle any server errors
        res.status(500).render('guest/hotelList', {
            pageTitle: 'Error',
            hotels: [], // Pass an empty array
            error: 'An error occurred while fetching the list of hotels.',
        });
    }
};


exports.showForm = async (req, res) => {
    try {
        const hotel = await Hotel.findById(req.params.hotelId);
        if (!hotel) {
            return res.status(404).send('Hotel not found');
        }

        let formData = {};
        if (req.session.guest?.id) {
            const guest = await Guest.findById(req.session.guest.id);
            if (guest) {
                formData = {
                    fullName: guest.fullName,
                    mobileNumber: guest.mobileNumber,
                    email: guest.email,
                    address: guest.address,
                    idProofNumber: guest.idProofNumber
                };
            }
        }

        res.render('guest/registerForm', {
            pageTitle: `Register at ${hotel.name}`,
            hotel,
            formData,
            errors: []
        });
    } catch (err) {
        console.error('Error loading form:', err.message);
        res.status(500).send('An error occurred while loading the form');
    }
};

// Guest login
exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const guest = await Guest.findOne({ username }).populate('hotel');
        if (!guest) {
            return res.render('guest/login', { error: 'Invalid username or password' });
        }

        const isMatch = await bcrypt.compare(password, guest.password);
        if (!isMatch) {
            return res.render('guest/login', { error: 'Invalid username or password' });
        }

        if (!guest.hotel) {
            return res.render('guest/login', { error: 'No associated hotel found. Contact admin.' });
        }

        req.session.guest = {
            id: guest._id,
            username: guest.username,
            hotelId: guest.hotel._id,
        };

        res.redirect('/guest/admin/panel');
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).render('guest/login', { error: 'Internal server error' });
    }
};

exports.showAdminPanel = async (req, res) => {
    try {
        const guestAdminHotelId = req.session.guest?.hotelId; // Get hotelId from logged-in guest session

        if (!guestAdminHotelId) {
            req.session.error = 'Guest Admin not associated with a hotel. Please log in again or contact admin.';
            return res.status(400).redirect('/guest/login');
        }

        const hotel = await Hotel.findById(guestAdminHotelId);
        if (!hotel) {
            req.session.error = 'Associated hotel not found for this Guest Admin.';
            return res.status(404).redirect('/guest/login');
        }

        // --- CRITICAL CHANGE HERE: Fetch ALL guests for this specific hotel ---
        const guestsForHotel = await Guest.find({ hotel: guestAdminHotelId }).sort({ createdAt: -1 });

        res.render('guest/adminPanel', {
            pageTitle: `Guest Admin Panel - ${hotel.name}`,
            hotel,
            guests: guestsForHotel, // Pass all guests for the hotel
            error: req.session.error || null, // Pass error from session
            success: req.session.success || null // Pass success from session
        });
        delete req.session.error; // Clear after rendering
        delete req.session.success; // Clear after rendering

    } catch (error) {
        console.error('Error loading guest admin panel:', error);
        req.session.error = 'An error occurred while loading the guest admin panel.';
        res.status(500).redirect('/guest/login'); // Redirect to login on error
    }
};

exports.signup = async (req, res) => {
    const { username, password, confirmPassword, hotelId, fullName, mobileNumber, email, address, purpose, stayFrom, stayTo, idProofNumber } = req.body;

    if (password !== confirmPassword) {
        return res.render('guest/signup', { errors: [{ msg: 'Passwords do not match' }], hotels: await Hotel.find() });
    }

    try {
        const existingGuest = await Guest.findOne({ idProofNumber });
        if (existingGuest) {
            return res.render('guest/signup', {
                errors: [{ msg: `Guest with ID proof number ${idProofNumber} already exists.` }],
                hotels: await Hotel.find(),
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newGuest = new Guest({
            username,
            password: hashedPassword,
            fullName,
            mobileNumber,
            email,
            address,
            purpose,
            stayDates: {
                from: new Date(stayFrom),
                to: new Date(stayTo),
            },
            idProofNumber,
            hotel: hotelId,
        });

        await newGuest.save();
        res.redirect('/guest/login');
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).render('guest/signup', { errors: [{ msg: 'Internal server error' }], hotels: await Hotel.find() });
    }
};

exports.getGuests = async (req, res) => {
    try {
        const hotelId = req.params.hotelId;
        const guests = await Guest.find({ hotel: hotelId });
        const hotel = await Hotel.findById(hotelId);

        if (!hotel) {
            return res.status(404).render('guest/adminPanel', {
                guests: [],
                hotel: null,
                error: 'Hotel not found'
            });
        }

        res.render('guest/adminPanel', { guests, hotel });
    } catch (error) {
        console.error('Error fetching guests:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.viewGuestDetails = async (req, res) => {
    try {
        const guest = await Guest.findById(req.params.guestId).populate('hotel');
        if (!guest) {
            return res.status(404).render('guest/adminPanel', {
                pageTitle: 'Guest Not Found',
                error: 'The guest details you are looking for do not exist.',
                guests: [],
                hotel: null
            });
        }

        res.render('guest/viewGuest', {
            pageTitle: `Guest Details - ${guest.fullName}`,
            guest,
            hotel: guest.hotel,
            error: null
        });
    } catch (error) {
        console.error('Error fetching guest details:', error.message);
        res.status(500).render('guest/adminPanel', {
            pageTitle: 'Error',
            error: 'An error occurred while fetching guest details.',
            guests: [],
            hotel: null
        });
    }
};

// Fetch a guest's details for editing
exports.getGuestDetails = async (req, res) => {
    try {
        const guest = await Guest.findById(req.params.guestId); // Fetch guest by ID
        if (!guest) {
            return res.status(404).render('admin/guestDetails', {
                pageTitle: 'Guest Not Found',
                message: 'The guest details you are looking for do not exist.',
            });
        }
        res.render('admin/editGuest', { guest });
    } catch (error) {
        console.error('Error fetching guest details:', error);
        res.status(500).render('index', {
            pageTitle: 'Error',
            message: 'An error occurred while fetching guest details.',
        });
    }
};

/// Update guest's details after editing
exports.editGuest = async (req, res) => {
    try {
        const { fullName, mobileNumber, purpose, stayDates, email, address, idProofNumber } = req.body; // Added address, idProofNumber
        
        const updatedStayDates = {
            from: new Date(stayDates.from),
            to: new Date(stayDates.to),
        };

        const updatedGuest = await Guest.findByIdAndUpdate(req.params.guestId, {
            fullName,
            mobileNumber,
            purpose,
            stayDates: updatedStayDates,
            email,
            address, // Ensure address is updated
            idProofNumber // Ensure idProofNumber is updated
        }, { new: true, runValidators: true }); // runValidators ensures schema validations are run on update

        if (!updatedGuest) {
            req.session.error = 'Guest not found for editing.';
            return res.status(404).redirect('/guest/admin/panel'); // Redirect to panel on error
        }

        req.session.success = 'Guest details updated successfully! ✨'; // Set success message
        res.redirect('/guest/admin/panel'); // Redirect back to the guest admin panel
    } catch (error) {
        console.error('Error editing guest:', error);
        req.session.error = 'An error occurred while editing the guest details.'; // Set error message
        res.status(500).redirect('/guest/admin/panel'); // Redirect to panel on error
    }
};

exports.submitForm = async (req, res) => {
    try {
        const errors = validationResult(req);
        const hotelId = req.params.hotelId; // Get hotelId from params
        const hotel = await Hotel.findById(hotelId); // Fetch hotel details

        if (!hotel) {
            req.session.error = 'Hotel not found for registration.';
            return res.status(404).redirect('/guest/hotels');
        }

        if (!errors.isEmpty()) {
            // Pass errors and formData back to the form for re-rendering
            return res.render('guest/registerForm', {
                pageTitle: `Register at ${hotel.name}`,
                hotel,
                formData: req.body,
                errors: errors.array()
            });
        }

        const { fullName, mobileNumber, email, address, purpose, stayDates, idProofNumber } = req.body;

        // Convert stayDates to Date objects for proper comparison
        const newStayFrom = new Date(stayDates.from);
        const newStayTo = new Date(stayDates.to);

        // --- CRITICAL CHANGE: Comprehensive Date Clash Logic ---
        // Query for existing bookings for this hotel that overlap with the new dates
        const overlappingBookings = await Guest.find({
            hotel: hotelId, // Ensure we only check for the specific hotel
            $and: [
                { 'stayDates.from': { $lt: newStayTo } }, // Existing booking starts BEFORE new booking ends
                { 'stayDates.to': { $gt: newStayFrom } }  // Existing booking ends AFTER new booking starts
            ]
        });

        if (overlappingBookings.length > 0) {
            // If any overlapping booking is found, display an error
            req.session.error = `Hotel ${hotel.name} is reserved for some dates within your selected period (${newStayFrom.toLocaleDateString()} to ${newStayTo.toLocaleDateString()}). Please choose different dates.`;
            return res.render('guest/registerForm', {
                pageTitle: `Register at ${hotel.name}`,
                hotel,
                formData: req.body,
                errors: [{ msg: req.session.error }] // Pass error to view
            });
        }
        // --- END OF CRITICAL CHANGE ---

        // Check if ID proof number already exists (for unique guest identification)
        const existingGuestByIdProof = await Guest.findOne({ idProofNumber });
        if (existingGuestByIdProof) {
            req.session.error = 'A guest with the same ID proof number already exists. If you are returning, please log in.';
            return res.render('guest/registerForm', {
                pageTitle: `Register at ${hotel.name}`,
                hotel,
                formData: req.body,
                errors: [{ msg: req.session.error }]
            });
        }

        // Generate a unique username for the guest (e.g., using ID proof number, ensuring no spaces)
        const username = `guest_${idProofNumber.replace(/\s/g, '')}`;

        const guest = new Guest({
            hotel: hotelId, // Use the extracted hotelId
            fullName,
            username,
            mobileNumber,
            email,
            address,
            purpose,
            stayDates: {
                from: newStayFrom, // Use converted Date objects
                to: newStayTo // Use converted Date objects
            },
            idProofNumber
        });

        await guest.save();
        req.session.success = `Thank you, ${guest.fullName}! Your registration is complete.`;
        res.render('guest/thankyou', {
            pageTitle: 'Registration Successful',
            fullName: guest.fullName,
            success: req.session.success // Pass success to thankyou page
        });
        // Clear session messages after rendering the thank you page
        delete req.session.success;
        delete req.session.error;
    } catch (err) {
        console.error('Guest form submission error:', err.message);
        const hotel = await Hotel.findById(req.params.hotelId); // Re-fetch hotel for error rendering
        req.session.error = 'An error occurred during registration. Please try again.';
        res.status(500).render('guest/registerForm', {
            pageTitle: 'Error',
            hotel,
            formData: req.body,
            errors: [{ msg: err.message || req.session.error }]
        });
    }
};

exports.showSignup = async (req, res) => {
    try {
        const hotels = await Hotel.find();
        res.render('guest/signup', { errors: [], hotels });
    } catch (error) {
        console.error('Error fetching hotels:', error.message);
        res.status(500).render('guest/signup', {
            errors: [{ msg: 'An error occurred while loading the signup page.' }],
            hotels: [],
        });
    }
};



exports.showLogin = (req, res) => {
    res.render('guest/login', { errors: [] });
};


exports.addGuest = async (req, res) => {
    const { name, mobile, address, visitPurpose, stayDates, email, idProof } = req.body;
    await Guest.create({ name, mobile, address, visitPurpose, stayDates, email, idProof });
    res.render('thankYou');
};
```

# fileStructure.txt

```txt
├── .env
├── app.js
├── config
    └── db.js
├── controllers
    ├── adminController.js
    ├── authController.js
    └── guestController.js
├── fileStructure.txt
├── middleware
    ├── authMiddleware.js
    ├── uploadMiddleware.js
    └── validationMiddleware.js
├── models
    ├── admin.js
    ├── guest.js
    └── hotel.js
├── package-lock.json
├── package.json
├── public
    ├── scripts
    │   └── validation.js
    └── styles.css
├── routes
    ├── adminRoutes.js
    └── guestRoutes.js
├── testBcrypt.js
├── utils
    └── qrCode.js
└── views
    ├── admin
        ├── dashboard.ejs
        ├── editGuest.ejs
        ├── guestDetails.ejs
        ├── hotels.ejs
        ├── login.ejs
        └── viewGuest.ejs
    ├── guest
        ├── adminPanel.ejs
        ├── hotelDetails.ejs
        ├── form.ejs
        ├── hotels.ejs
        ├── signup.ejs
        └── thankyou.ejs
    └── index.ejs
    └── layout.ejs
```

# middleware\authMiddleware.js

```js
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
```

# middleware\uploadMiddleware.js

```js
// middleware/uploadMiddleware.js
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type! Only images are allowed.'));
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

module.exports = upload.fields([
    { name: 'logo', maxCount: 1 }, 
    { name: 'photos', maxCount: 10 } // Max 10 photos
]);
```

# middleware\validationMiddleware.js

```js
// middleware/validationMiddleware.js
const { body, validationResult } = require('express-validator');

exports.guestValidationRules = [
    body('fullName')
        .trim()
        .notEmpty().withMessage('Full name is required')
        .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
    
    body('mobileNumber')
        .matches(/^[0-9]{10}$/).withMessage('Please enter a valid 10-digit mobile number'),
    
    body('address')
        .trim()
        .notEmpty().withMessage('Address is required')
        .isLength({ min: 5 }).withMessage('Address must be at least 5 characters long'),
    
    body('purpose')
        .isIn(['Business', 'Personal', 'Tourist']).withMessage('Invalid purpose selected'),
    
    body('stayDates.from')
        .isISO8601().withMessage('Invalid check-in date')
        .custom((value, { req }) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const fromDate = new Date(value);
            if (fromDate < today) {
                throw new Error('Check-in date cannot be in the past');
            }
            return true;
        }),
    
        body('stayDates.to')
        .isISO8601().withMessage('Invalid check-out date')
        .custom((value, { req }) => {
            const fromDate = new Date(req.body.stayDates.from);
            const toDate = new Date(value);
            if (toDate <= fromDate) {
                throw new Error('Check-out date must be after check-in date');
            }
            if (toDate > new Date(fromDate.getTime() + 30 * 24 * 60 * 60 * 1000)) {
                throw new Error('Stay cannot exceed 30 days');
            }
            return true;
        }),
    
    body('email')
        .trim()
        .isEmail().withMessage('Please enter a valid email address')
        .normalizeEmail(),
    
    body('idProofNumber')
        .trim()
        .notEmpty().withMessage('ID proof number is required')
        .isLength({ min: 5, max: 20 }).withMessage('ID proof number must be between 5 and 20 characters')
];

exports.hotelValidationRules = [
    body('name')
        .trim()
        .notEmpty().withMessage('Hotel name is required')
        .isLength({ min: 2, max: 100 }).withMessage('Hotel name must be between 2 and 100 characters'),
    
    body('address')
        .trim()
        .notEmpty().withMessage('Address is required')
        .isLength({ min: 5 }).withMessage('Address must be at least 5 characters long')
];

exports.validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(err => err.msg);

        // Determine the template and page title dynamically
        const template = req.originalUrl.includes('guest') ? 'guest/form' : 'admin/hotels';
        const pageTitle = req.originalUrl.includes('guest') ? 'Guest Registration' : 'Manage Hotels';

        return res.render(template, {
            errors: errorMessages,
            formData: req.body,
            pageTitle,
        });
    }
    next();
};
```

# models\admin.js

```js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Ensure bcryptjs is imported

const adminSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'admin' }
}, { collection: 'users', timestamps: true });

adminSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10); // Generate a salt
        this.password = await bcrypt.hash(this.password, salt); // Hash the password
    }
    next();
});

module.exports = mongoose.model('Admin', adminSchema);
```

# models\guest.js

```js
const mongoose = require('mongoose'); // Import mongoose

const guestSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fullName: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    address: { type: String, required: true },
    purpose: { type: String, required: true },
    stayDates: {
        from: { type: Date, required: true },
        to: { type: Date, required: true },
    },
    idProofNumber: { type: String, required: true, unique: true },
    hotel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true },
});


// Validation for stay dates
guestSchema.pre('save', function (next) {
    if (this.stayDates.from > this.stayDates.to) {
        next(new Error('Check-out date must be after check-in date'));
    }
    next();
});

module.exports = mongoose.model('Guest', guestSchema);
```

# models\hotel.js

```js
const mongoose = require('mongoose');

const HotelSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    description: { type: String, required: true },
    logo: { type: String, required: true },
    photos: { type: [String], required: true }, // Array of photo filenames
    qrCode: { type: String } // Path to QR code image
});

module.exports = mongoose.model('Hotel', HotelSchema);
```

# package.json

```json
{
  "name": "guest-onboarding",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "body-parser": "^1.20.3",
    "cookie-parser": "^1.4.7",
    "dotenv": "^16.4.7",
    "ejs": "^3.1.10",
    "express": "^4.21.2",
    "express-ejs-layouts": "^2.5.1",
    "express-session": "^1.18.1",
    "express-validator": "^7.2.1",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.9.5",
    "multer": "^1.4.5-lts.1",
    "qrcode": "^1.5.4"
  },
  "devDependencies": {
    "nodemon": "^3.1.9"
  }
}

```

# public\assets\hotel1.jpeg

This is a binary file of the type: Image

# public\assets\hotel2.jpeg

This is a binary file of the type: Image

# public\assets\hotel3.jpeg

This is a binary file of the type: Image

# public\assets\hotel4.jpeg

This is a binary file of the type: Image

# public\assets\hotel5.jpeg

This is a binary file of the type: Image

# public\assets\hotel6.jpeg

This is a binary file of the type: Image

# public\scripts\validation.js

```js
// public/scripts/validation.js
document.addEventListener('DOMContentLoaded', function() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        // Real-time validation
        form.querySelectorAll('input, select').forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                if (this.classList.contains('is-invalid')) {
                    validateField(this);
                }
            });
        });

        // Form submission
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            if (validateForm(this)) {
                this.submit();
            }
        });
    });
});

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';

    // Remove existing error messages
    const existingError = field.nextElementSibling;
    if (existingError && existingError.classList.contains('invalid-feedback')) {
        existingError.remove();
    }

    // Validation rules
    switch(field.name) {
        case 'fullName':
            if (!value) {
                isValid = false;
                errorMessage = 'Full name is required';
            } else if (value.length < 2 || value.length > 50) {
                isValid = false;
                errorMessage = 'Name must be between 2 and 50 characters';
            }
            break;

        case 'mobile':
            if (!value.match(/^[0-9]{10}$/)) {
                isValid = false;
                errorMessage = 'Please enter a valid 10-digit mobile number';
            }
            break;

        case 'email':
            if (!value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
            break;

        case 'purpose':
            if (!['Business', 'Personal', 'Tourist'].includes(value)) {
                isValid = false;
                errorMessage = 'Please select a valid purpose';
            }
            break;

        // Add more cases as needed
    }

    // Update UI
    if (!isValid) {
        field.classList.add('is-invalid');
        field.classList.remove('is-valid');
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'invalid-feedback';
        errorDiv.textContent = errorMessage;
        field.parentNode.insertBefore(errorDiv, field.nextSibling);
    } else {
        field.classList.remove('is-invalid');
        field.classList.add('is-valid');
    }

    return isValid;
}

function validateForm(form) {
    let isValid = true;
    form.querySelectorAll('input, select').forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    return isValid;
}
```

# public\styles.css

```css
/* public/styles.css */
:root {
    --primary-color: #4a90e2;
    --secondary-color: #f5f5f5;
    --success-color: #28a745;
    --danger-color: #dc3545;
    --warning-color: #ffc107;
    --info-color: #17a2b8;
    --dark-color: #343a40;
    --light-color: #f8f9fa;
}

/* General Styles */
body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
    background-color: #f4f6f9;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 15px;
}

/* Card Styles */
.card {
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    margin-bottom: 20px;
    transition: transform 0.2s ease;
}

.card:hover {
    transform: translateY(-2px);
}

.card-header {
    background-color: #fff;
    border-bottom: 1px solid #eee;
    padding: 15px 20px;
}

.card-body {
    padding: 20px;
}

/* Form Styles */
.form-control {
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 8px 12px;
    transition: border-color 0.2s ease;
}

.form-control:focus {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 0.2rem rgba(74, 144, 226, 0.25);
}

.form-label {
    font-weight: 500;
    margin-bottom: 8px;
}

/* Button Styles */
.btn {
    padding: 8px 16px;
    border-radius: 4px;
    font-weight: 500;
    transition: all 0.2s ease;
}

.btn-primary {
    background-color: var(--primary-color);
    border: none;
}

.btn-primary:hover {
    background-color: #357abd;
    transform: translateY(-1px);
}

/* Table Styles */
.table {
    width: 100%;
    margin-bottom: 1rem;
    background-color: transparent;
}

.table th {
    padding: 12px;
    border-bottom: 2px solid #dee2e6;
    font-weight: 600;
}

.table td {
    padding: 12px;
    border-bottom: 1px solid #dee2e6;
}

.table-hover tbody tr:hover {
    background-color: rgba(0,0,0,.075);
}

/* Alert Styles */
.alert {
    padding: 12px 20px;
    margin-bottom: 1rem;
    border: 1px solid transparent;
    border-radius: 4px;
}

.alert-success {
    color: #155724;
    background-color: #d4edda;
    border-color: #c3e6cb;
}

.alert-danger {
    color: #721c24;
    background-color: #f8d7da;
    border-color: #f5c6cb;
}

/* Navigation Styles */
.navbar {
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    padding: 1rem 0;
}

.navbar-brand {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--primary-color);
}

/* Dashboard Stats */
.stats-card {
    background: linear-gradient(135deg, var(--primary-color) 0%, #357abd 100%);
    color: white;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 20px;
}

.stats-card h3 {
    font-size: 2rem;
    margin: 0;
}

.stats-card p {
    margin: 5px 0 0;
    opacity: 0.8;
}

/* QR Code Styles */
.qr-code-container {
    background: white;
    padding: 20px;
    border-radius: 8px;
    display: inline-block;
}

/* Print Styles */
@media print {
    .no-print {
        display: none;
    }
    
    body {
        padding: 20px;
    }
    
    .container {
        width: 100%;
        max-width: none;
    }
}
```

# public\uploads\1737650059028-car loading.jpg

This is a binary file of the type: Image

# public\uploads\1737650059030-hotel1.jpeg

This is a binary file of the type: Image

# public\uploads\1737650059030-hotel2.jpeg

This is a binary file of the type: Image

# public\uploads\1737650059031-hotel3.jpeg

This is a binary file of the type: Image

# public\uploads\1737650059031-hotel4.jpeg

This is a binary file of the type: Image

# public\uploads\1737650059035-hotel5.jpeg

This is a binary file of the type: Image

# public\uploads\1737650059036-hotel6.jpeg

This is a binary file of the type: Image

# public\uploads\1737868466603-coins.jpeg

This is a binary file of the type: Image

# public\uploads\1737868466607-hotel2.jpeg

This is a binary file of the type: Image

# public\uploads\1737868466608-hotel4.jpeg

This is a binary file of the type: Image

# public\uploads\1737868466609-hotel6.jpeg

This is a binary file of the type: Image

# public\uploads\1737914956220-Registration background.webp

This is a binary file of the type: Image

# public\uploads\1737914956222-hotel1.jpeg

This is a binary file of the type: Image

# public\uploads\1737914956223-hotel3.jpeg

This is a binary file of the type: Image

# public\uploads\1737914956223-hotel5.jpeg

This is a binary file of the type: Image

# public\uploads\1737914956224-hotel6.jpeg

This is a binary file of the type: Image

# routes\adminRoutes.js

```js
//adminRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const adminController = require('../controllers/adminController');
const { ensureAdminLoggedIn } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { hotelValidationRules, validate } = require('../middleware/validationMiddleware');

// Public routes (Admin Login/Logout)
router.get('/login', (req, res) => {
    if (req.session.user && req.session.user.role === 'admin') {
        return res.redirect('/admin/dashboard');
    }
    res.render('admin/login', { pageTitle: 'Admin Login', error: req.session.error || null });
    delete req.session.error;
});

router.post('/login', authController.login);

router.get('/logout', (req, res) => {
    req.session.success = 'You have been logged out successfully.';

    res.clearCookie('token'); // Clear JWT cookie (if any was set)
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            req.session.error = 'Failed to log out completely. Please try again.';
        }
        res.redirect('/admin/login');
    });
});

// Protected routes for Main Admin
router.use(ensureAdminLoggedIn);

// Admin Dashboard
router.get('/dashboard', adminController.dashboard);

// Hotel Management
router.get('/hotels', adminController.getHotels);
router.post('/add-hotel', upload, hotelValidationRules, validate, adminController.addHotel);
router.post('/hotels/:id/delete', adminController.deleteHotel);

// Guest Management for Main Admin
router.get('/hotels/:id/guests', adminController.getHotelGuests);
router.get('/guests/:id', adminController.viewGuestDetails);
router.get('/guests/:id/actions', adminController.guestActions);
router.post('/guests/:guestId/edit', adminController.editGuest);

module.exports = router;
```

# routes\guestRoutes.js

```js
const express = require('express');
const router = express.Router();
const guestController = require('../controllers/guestController');
const { ensureGuestLoggedIn } = require('../middleware/authMiddleware');
const { guestValidationRules, validate } = require('../middleware/validationMiddleware');

// Public Guest Routes
router.get('/', guestController.showLogin);

router.get('/login', guestController.showLogin);
router.post('/login', guestController.login);

router.get('/signup', guestController.showSignup);
router.post('/signup', guestController.signup);

router.get('/hotels', guestController.listHotels);
router.get('/hotel/:id', guestController.hotelDetails);

router.get('/form/:hotelId', guestController.showForm);
router.post('/form/:hotelId', guestValidationRules, validate, guestController.submitForm);

router.get('/logout', (req, res) => {
    // --- CRITICAL CHANGE HERE ---
    // Set success message BEFORE destroying the session
    req.session.success = 'You have been logged out successfully.';

    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying guest session:', err);
            req.session.error = 'Failed to log out completely. Please try again.';
        }
        res.redirect('/guest/login');
    });
});

// Guest Admin Panel Routes (protected)
router.use(ensureGuestLoggedIn);

router.get('/admin/panel', guestController.showAdminPanel);
router.get('/admin/edit-guest/:guestId', guestController.getGuestDetails);
router.post('/admin/edit-guest/:guestId', guestController.editGuest);
router.get('/admin/view-guest/:guestId', guestController.viewGuestDetails);

module.exports = router;
```

# utils\qrCode.js

```js
const QRCode = require('qrcode');

exports.generateQRCode = async (hotelId) => {
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000'; // Dynamic base URL
    const hotelUrl = `${baseUrl}/guest/hotel/${hotelId}`;
    try {
        const qrCode = await QRCode.toDataURL(hotelUrl);
        return qrCode;
    } catch (error) {
        console.error('Error generating QR code:', error);
        throw error;
    }
};

module.exports = generateQRCode;
```

# vercel.json

```json
{
    "version": 2,
    "builds": [
      {
        "src": "app.js",
        "use": "@vercel/node"
      }
    ],
    "routes": [
      {
        "src": "/(.*)",
        "dest": "app.js",
        "methods": ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
      }
    ]
  }  
```

# views\admin\dashboard.ejs

```ejs
<header>
    <h1>Admin Dashboard</h1>
    <a href="/admin/logout" class="btn btn-danger" style="float: right;">Logout</a>
</header>
<main>
    <div class="container">
        <div class="row">
            <div class="col-md-4">
                <div class="card bg-primary text-white mb-4">
                    <div class="card-body">
                        <h5 class="card-title">Total Hotels</h5>
                        <h2>
                            <%= hotels.length %>
                        </h2>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card bg-success text-white mb-4">
                    <div class="card-body">
                        <h5 class="card-title">Total Guests</h5>
                        <h2>
                            <%= totalGuests %>
                        </h2>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card bg-info text-white mb-4">
                    <div class="card-body">
                        <h5 class="card-title">Today's Check-ins</h5>
                        <h2>
                            <%= todayCheckIns %>
                        </h2>
                    </div>
                </div>
            </div>
        </div>

        <div class="row mt-4">
            <div class="col-12">
                <div class="card">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h5 class="mb-0">Recent Activities</h5>
                        <a href="/admin/hotels" class="btn btn-primary">Manage Hotels</a>
                    </div>
                    <div class="card-body">
                        <div class="table-responsive">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>Hotel</th>
                                        <th>Today's Guests</th>
                                        <th>Total Guests</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <% hotels.forEach(hotel=> { %>
                                        <tr>
                                            <td>
                                                <%= hotel.name %>
                                            </td>
                                            <td>
                                                <%= hotel.todayGuests || 0 %>
                                            </td>
                                            <td>
                                                <%= hotel.totalGuests || 0 %>
                                            </td>
                                            <td>
                                                <a href="/admin/hotels/<%= hotel._id %>/guests"
                                                    class="btn btn-sm btn-primary">Guests</a>
                                            </td>
                                        </tr>
                                        <% }); %>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</main>
```

# views\admin\editGuest.ejs

```ejs
<h1>Edit Guest Details</h1>
<form action="/guest/admin/edit-guest/<%= guest._id %>" method="POST">
    <div class="mb-3">
        <label for="fullName" class="form-label">Full Name</label>
        <input type="text" class="form-control" id="fullName" name="fullName" value="<%= guest.fullName %>" required>
    </div>
    <div class="mb-3">
        <label for="mobileNumber" class="form-label">Mobile Number</label>
        <input type="text" class="form-control" id="mobileNumber" name="mobileNumber" value="<%= guest.mobileNumber %>" required>
    </div>
    <div class="mb-3">
        <label for="purpose" class="form-label">Purpose of Visit</label>
        <select class="form-control" id="purpose" name="purpose" required>
            <option value="Business" <%= guest.purpose === 'Business' ? 'selected' : '' %>>Business</option>
            <option value="Personal" <%= guest.purpose === 'Personal' ? 'selected' : '' %>>Personal</option>
            <option value="Tourist" <%= guest.purpose === 'Tourist' ? 'selected' : '' %>>Tourist</option>
        </select>
    </div>
    <div class="mb-3">
        <label for="fromDate" class="form-label">Stay Dates (From)</label>
        <input type="date" class="form-control" id="fromDate" name="stayDates[from]" value="<%= guest.stayDates.from %>" required>
    </div>
    <div class="mb-3">
        <label for="toDate" class="form-label">Stay Dates (To)</label>
        <input type="date" class="form-control" id="toDate" name="stayDates[to]" value="<%= guest.stayDates.to %>" required>
    </div>
    <div class="mb-3">
        <label for="email" class="form-label">Email ID</label>
        <input type="email" class="form-control" id="email" name="email" value="<%= guest.email %>" required>
    </div>
    <button type="submit" class="btn btn-primary">Update Guest</button>
</form>
```

# views\admin\guestDetails.ejs

```ejs
<h3>Guests for <%= hotel.name %></h3>

<table class="table">
    <thead>
        <tr>
            <th>Full Name</th>
            <th>Email</th>
            <th>Check-in Date</th>
            <th>Check-out Date</th>
        </tr>
    </thead>
    <tbody>
        <% guests.forEach(guest => { %>
        <tr>
            <td><%= guest.fullName %></td>
            <td><%= guest.email %></td>
            <td><%= guest.stayDates ? guest.stayDates.from.toDateString() : 'N/A' %></td>
            <td><%= guest.stayDates ? guest.stayDates.to.toDateString() : 'N/A' %></td>
        </tr>
        <% }) %>
    </tbody>
</table>
```

# views\admin\hotelDetails.ejs

```ejs
<% content = 'layout' %>
<div class="container mt-4">
    <h1><%= hotel.name %> Details</h1>
    <div class="card">
        <div class="card-body">
            <h5 class="card-title">Hotel Information</h5>
            <p><strong>Name:</strong> <%= hotel.name %></p>
            <p><strong>Address:</strong> <%= hotel.address %></p>
            <p><strong>Description:</strong> <%= hotel.description %></p>
            <% if (hotel.logo) { %>
                <img src="/uploads/<%= hotel.logo %>" alt="Hotel Logo" class="img-fluid mb-3">
            <% } %>
            <a href="/admin/hotels/<%= hotel._id %>/guests" class="btn btn-primary">View Guests</a>
        </div>
    </div>
</div>
```

# views\admin\hotels.ejs

```ejs
<div class="container">
    <h1 class="mb-4">Manage Hotels</h1>

    <% if (error) { %>
        <div class="alert alert-danger">
            <%= error %>
        </div>
        <% } %>

            <div class="card mb-4">
                <div class="card-header">
                    <h5 class="mb-0">Add New Hotel</h5>
                </div>
                <div class="card-body">
                    <form method="POST" action="/admin/add-hotel" enctype="multipart/form-data">
                        <div class="mb-3">
                            <label for="name" class="form-label">Hotel Name</label>
                            <input type="text" class="form-control" id="name" name="name" required>
                        </div>
                        <div class="mb-3">
                            <label for="address" class="form-label">Address</label>
                            <input type="text" class="form-control" id="address" name="address" required>
                        </div>
                        <div class="mb-3">
                            <label for="description" class="form-label">Description</label>
                            <textarea class="form-control" id="description" name="description" rows="3" required></textarea>
                        </div>
                        <div class="mb-3">
                            <label for="logo" class="form-label">Logo</label>
                            <input type="file" class="form-control" id="logo" name="logo" accept="image/*" required>
                        </div>
                        <div class="mb-3">
                            <label for="photos" class="form-label">Hotel Photos (at least 3)</label>
                            <input type="file" class="form-control" id="photos" name="photos" accept="image/*" multiple required>
                        </div>
                        <button type="submit" class="btn btn-primary">Add Hotel</button>
                    </form>
                </div>                
            </div>

            <div class="card">
                <div class="card-header">
                    <h5 class="mb-0">Hotel List</h5>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Address</th>
                                    <th>Logo</th>
                                    <th>QR Code</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <% hotels.forEach(hotel => { %>
                                    <tr>
                                        <td><%= hotel.name %></td>
                                        <td><%= hotel.address %></td>
                                        <td><img src="/uploads/<%= hotel.logo %>" alt="Logo" style="height: 50px;"></td>
                                        <td><img src="<%= hotel.qrCode %>" alt="QR Code" style="height: 50px;"></td>
                                        <td>
                                            <a href="/admin/hotels/<%= hotel._id %>/guests" class="btn btn-sm btn-info">View Guests</a>
                                            <form action="/admin/hotels/<%= hotel._id %>/delete" method="POST" style="display:inline;">
                                                <button type="submit" class="btn btn-sm btn-danger">Delete</button>
                                            </form>
                                        </td>
                                    </tr>
                                <% }) %>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
</div>
```

# views\admin\login.ejs

```ejs
<!DOCTYPE html>
<html>

<head>
    <title>Admin Login</title>
</head>

<body>
    <h1>Admin Login</h1>
    <form method="POST" action="/admin/login">
        <div class="mb-3">
            <input type="text" name="username" class="form-control" placeholder="Username" required />
        </div>
        <div class="mb-3">
            <input type="password" name="password" class="form-control" placeholder="Password" required />
        </div>
        <button type="submit" class="btn btn-primary">Login</button>
        <% if (error) { %>
            <p style="color: red;">
                <%= error %>
            </p>
            <% } %>
    </form>
</body>

</html>
```

# views\admin\viewGuest.ejs

```ejs
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Guest Details</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
    <div class="container mt-5">
        <h2 class="text-center">Guest Details</h2>
        <table class="table table-bordered mt-4">
            <tr>
                <th>Full Name</th>
                <td><%= guest.fullName %></td>
            </tr>
            <tr>
                <th>Mobile Number</th>
                <td><%= guest.mobileNumber %></td>
            </tr>
            <tr>
                <th>Email</th>
                <td><%= guest.email %></td>
            </tr>
            <tr>
                <th>Address</th>
                <td><%= guest.address %></td>
            </tr>
            <tr>
                <th>Purpose</th>
                <td><%= guest.purpose %></td>
            </tr>
            <tr>
                <th>Stay Dates</th>
                <td><%= guest.stayDates.from.toDateString() %> to <%= guest.stayDates.to.toDateString() %></td>
            </tr>
            <tr>
                <th>Hotel</th>
                <td><%= guest.hotel.name %></td>
            </tr>
            <tr>
                <th>ID Proof</th>
                <td><%= guest.idProofNumber %></td>
            </tr>
        </table>
        <div class="text-center mt-4">
            <button class="btn btn-primary" onclick="window.print()">Print</button>
            <a href="/admin/guests" class="btn btn-secondary">Back to Guest List</a>
        </div>
    </div>
</body>
</html>
```

# views\guest\adminPanel.ejs

```ejs
<div class="container mt-4">
    <h2>Guest Admin Panel</h2>

    <% if (!hotel) { %>
        <div class="alert alert-danger">
            <p>Unable to find the associated hotel. Please contact support.</p>
        </div>
    <% } else { %>
        <p>Manage guests for <strong>
                <%= hotel.name %>
            </strong>.</p>
    <% } %>

    <% if (error) { %>
        <div class="alert alert-danger">
            <%= error %>
        </div>
    <% } %>

    <% if (success) { %>
        <div class="alert alert-success">
            <%= success %>
        </div>
    <% } %>

    <% if (guests.length > 0) { %>
        <div class="table-responsive mt-4">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>Full Name</th>
                        <th>Mobile</th>
                        <th>Purpose</th>
                        <th>Stay Dates</th>
                        <th>ID Proof Number</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <% guests.forEach(guest=> { %>
                        <tr>
                            <td>
                                <%= guest.fullName %>
                            </td>
                            <td>
                                <%= guest.mobileNumber %>
                            </td>
                            <td>
                                <%= guest.purpose %>
                            </td>
                            <td>
                                <%= guest.stayDates.from.toLocaleDateString() %> -
                                <%= guest.stayDates.to.toLocaleDateString() %>
                            </td>
                            <td>
                                <%= guest.idProofNumber %>
                            </td>
                            <td>
                                <a href="/guest/admin/edit-guest/<%= guest._id %>"
                                    class="btn btn-sm btn-warning">Edit</a>
                                <a href="/guest/admin/view-guest/<%= guest._id %>"
                                    class="btn btn-sm btn-info">View</a>
                            </td>
                        </tr>
                        <% }) %>
                </tbody>
            </table>
        </div>
        <% } else { %>
            <div class="alert alert-info mt-4">No guests found for this hotel.</div>
            <% } %>
                <div class="mt-4">
                    <a href="/guest/hotels" class="btn btn-primary">View Available Hotels</a>
                </div>
</div>
```

# views\guest\hotelDetails.ejs

```ejs
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>
        <%= hotel.name %> - Details
    </title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<div class="container mt-4">
    <h1 class="text-center">
        <%= hotel.name %>
    </h1>
    <p class="text-center text-muted">
        <%= hotel.address %>
    </p>
    <p>
        <%= hotel.description %>
    </p>

    <% if (hotel.photos && hotel.photos.length) { %>
        <div id="photoCarousel" class="carousel slide" data-bs-ride="carousel">
            <div class="carousel-inner">
                <% hotel.photos.forEach((photo, index)=> { %>
                    <div class="carousel-item <%= index === 0 ? 'active' : '' %>">
                        <img src="/uploads/<%= photo %>" class="d-block w-100" alt="Hotel Photo">
                    </div>
                    <% }) %>
            </div>
            <button class="carousel-control-prev" type="button" data-bs-target="#photoCarousel" data-bs-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#photoCarousel" data-bs-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Next</span>
            </button>
        </div>
        <% } %>

            <div class="text-center mt-4">
                <a href="/guest/hotels" class="btn btn-secondary">Back to Hotels</a>
                <a href="/guest/form/<%= hotel._id %>" class="btn btn-primary">Book Now</a>
            </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>

</html>
```

# views\guest\hotelList.ejs

```ejs
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Available Hotels</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>

<body>
    <div class="container mt-4">
        <h2 class="text-center mb-4">Available Hotels</h2>
        <% if (hotels.length > 0) { %>
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Address</th>
                        <th>QR Code</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <% hotels.forEach(hotel => { %>
                        <tr>
                            <td><%= hotel.name %></td>
                            <td><%= hotel.address %></td>
                            <td>
                                <% if (hotel.qrCode) { %>
                                    <img src="<%= hotel.qrCode %>" alt="QR Code" style="width: 100px;">
                                <% } else { %>
                                    No QR Code
                                <% } %>
                            </td>
                            <td>
                                <a href="/guest/hotel/<%= hotel._id %>" class="btn btn-info">View Details</a>
                            </td>
                        </tr>
                    <% }) %>
                </tbody>
            </table>
        <% } else { %>
            <p class="text-center text-danger">No hotels are available at the moment.</p>
        <% } %>
        <div class="text-center mt-4">
            <a href="/" class="btn btn-secondary">Back to Home</a>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>

</html>
```

# views\guest\login.ejs

```ejs
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Guest Login</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
    <div class="container mt-5">
        <h2 class="text-center">Guest Login</h2>
        <% if (error) { %>
            <div class="alert alert-danger"><%= error %></div>
        <% } %>
        <form action="/guest/login" method="POST">
            <div class="mb-3">
                <label for="username" class="form-label">Username</label>
                <input type="text" id="username" name="username" class="form-control" required>
            </div>
            <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input type="password" id="password" name="password" class="form-control" required>
            </div>
            <button type="submit" class="btn btn-primary w-100">Login</button>
        </form>
        <div class="text-center mt-3">
            <a href="/guest/signup">Don't have an account? Sign up here</a>
        </div>
    </div>
</body>
</html>
```

# views\guest\registerForm.ejs

```ejs
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Guest Registration - <%= hotel.name %></title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>

<body>
    <div class="container mt-4">
        <h2 class="text-center mb-4">Guest Registration for <%= hotel.name %></h2>
        <form method="POST" action="/guest/form/<%= hotel._id %>">
            <div class="mb-3">
                <label for="fullName" class="form-label">Full Name</label>
                <input type="text" class="form-control" id="fullName" name="fullName" value="<%= formData?.fullName || '' %>" required>
            </div>
            <div class="mb-3">
                <label for="mobileNumber" class="form-label">Mobile Number</label>
                <input type="tel" class="form-control" id="mobileNumber" name="mobileNumber" pattern="[0-9]{10}" value="<%= formData?.mobileNumber || '' %>" required>
            </div>
            <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input type="email" class="form-control" id="email" name="email" value="<%= formData?.email || '' %>" required>
            </div>
            <div class="mb-3">
                <label for="address" class="form-label">Address</label>
                <textarea class="form-control" id="address" name="address" rows="3" required><%= formData?.address || '' %></textarea>
            </div>
            <input type="hidden" name="hotel" value="<%= hotel._id %>">
            <div class="mb-3">
                <label for="idProofNumber" class="form-label">ID Proof Number</label>
                <input type="text" class="form-control" id="idProofNumber" name="idProofNumber" value="<%= formData?.idProofNumber || '' %>" required>
            </div>
            <div class="mb-3">
                <label for="purpose" class="form-label">Purpose of Visit</label>
                <select class="form-control" id="purpose" name="purpose" required>
                    <option value="">Select Purpose</option>
                    <option value="Business" <%= formData?.purpose === 'Business' ? 'selected' : '' %>>Business</option>
                    <option value="Personal" <%= formData?.purpose === 'Personal' ? 'selected' : '' %>>Personal</option>
                    <option value="Tourist" <%= formData?.purpose === 'Tourist' ? 'selected' : '' %>>Tourist</option>
                </select>
            </div>
            <div class="row">
                <div class="col-md-6 mb-3">
                    <label for="fromDate" class="form-label">Check-in Date</label>
                    <input type="date" class="form-control" id="fromDate" name="stayDates[from]" min="<%= new Date().toISOString().split('T')[0] %>" value="<%= formData?.stayDates?.from || '' %>" required>
                </div>
                <div class="col-md-6 mb-3">
                    <label for="toDate" class="form-label">Check-out Date</label>
                    <input type="date" class="form-control" id="toDate" name="stayDates[to]" value="<%= formData?.stayDates?.to || '' %>" required>
                </div>
            </div>
            <button type="submit" class="btn btn-primary w-100">Submit Registration</button>
        </form>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>

</html>
```

# views\guest\signup.ejs

```ejs
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Guest Signup</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>

<body>
    <div class="container mt-5">
        <h2 class="text-center">Guest Signup</h2>

        <!-- Display Errors -->
        <% if (errors && errors.length> 0) { %>
            <div class="alert alert-danger">
                <ul>
                    <% errors.forEach(error=> { %>
                        <li>
                            <%= error.msg %>
                        </li>
                        <% }) %>
                </ul>
            </div>
            <% } %>

                <!-- Signup Form -->
                <form action="/guest/signup" method="POST">
                    <!-- Username -->
                    <div class="mb-3">
                        <label for="username" class="form-label">Username</label>
                        <input type="text" id="username" name="username" class="form-control" required>
                    </div>

                    <!-- Password -->
                    <div class="mb-3">
                        <label for="password" class="form-label">Password</label>
                        <input type="password" id="password" name="password" class="form-control" required>
                    </div>

                    <!-- Confirm Password -->
                    <div class="mb-3">
                        <label for="confirmPassword" class="form-label">Confirm Password</label>
                        <input type="password" id="confirmPassword" name="confirmPassword" class="form-control"
                            required>
                    </div>

                    <!-- Select Hotel -->
                    <div class="mb-3">
                        <label for="hotelId" class="form-label">Select Hotel</label>
                        <select id="hotelId" name="hotelId" class="form-select" required>
                            <% hotels.forEach(hotel=> { %>
                                <option value="<%= hotel._id %>">
                                    <%= hotel.name %> - <%= hotel.address %>
                                </option>
                                <% }) %>
                        </select>
                    </div>

                    <!-- Full Name -->
                    <div class="mb-3">
                        <label for="fullName" class="form-label">Full Name</label>
                        <input type="text" id="fullName" name="fullName" class="form-control" required>
                    </div>

                    <!-- Mobile Number -->
                    <div class="mb-3">
                        <label for="mobileNumber" class="form-label">Mobile Number</label>
                        <input type="text" id="mobileNumber" name="mobileNumber" class="form-control" required>
                    </div>

                    <div class="mb-3">
                        <label for="email" class="form-label">Email</label>
                        <input type="email" id="email" name="email" class="form-control" required>
                    </div>


                    <!-- Address -->
                    <div class="mb-3">
                        <label for="address" class="form-label">Address</label>
                        <textarea id="address" name="address" class="form-control" rows="3" required></textarea>
                    </div>

                    <!-- Purpose of Visit -->
                    <div class="mb-3">
                        <label for="purpose" class="form-label">Purpose of Visit</label>
                        <select id="purpose" name="purpose" class="form-select" required>
                            <option value="Business">Business</option>
                            <option value="Personal">Personal</option>
                            <option value="Tourist">Tourist</option>
                        </select>
                    </div>

                    <!-- Stay Dates -->
                    <div class="mb-3">
                        <label for="stayFrom" class="form-label">Stay From</label>
                        <input type="date" id="stayFrom" name="stayFrom" class="form-control" required>
                    </div>

                    <div class="mb-3">
                        <label for="stayTo" class="form-label">Stay To</label>
                        <input type="date" id="stayTo" name="stayTo" class="form-control" required>
                    </div>

                    <!-- ID Proof Number -->
                    <div class="mb-3">
                        <label for="idProofNumber" class="form-label">ID Proof Number</label>
                        <input type="text" id="idProofNumber" name="idProofNumber" class="form-control" required>
                    </div>

                    <!-- Submit Button -->
                    <button type="submit" class="btn btn-primary w-100">Sign Up</button>
                </form>

                <!-- Login Link -->
                <div class="text-center mt-3">
                    <a href="/guest/login">Already have an account? Login here</a>
                </div>
    </div>
</body>

</html>
```

# views\guest\thankyou.ejs

```ejs

<h1>Thank You, <%= fullName %>!</h1>
<p>Your details have been successfully submitted.</p>
```

# views\guest\viewGuest.ejs

```ejs
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><%= pageTitle %></title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        .print-button {
            margin-bottom: 20px;
        }
        @media print {
            .print-button {
                display: none;
            }
        }
    </style>
</head>

<body>
    <div class="container mt-5">
        <h1 class="text-center mb-4"><%= hotel.name %></h1>
        <p><strong>Guest Details</strong></p>
        <table class="table table-bordered">
            <tr>
                <th>Full Name</th>
                <td><%= guest.fullName %></td>
            </tr>
            <tr>
                <th>Mobile Number</th>
                <td><%= guest.mobileNumber %></td>
            </tr>
            <tr>
                <th>Email</th>
                <td><%= guest.email %></td>
            </tr>
            <tr>
                <th>Address</th>
                <td><%= guest.address %></td>
            </tr>
            <tr>
                <th>Purpose</th>
                <td><%= guest.purpose %></td>
            </tr>
            <tr>
                <th>Stay Dates</th>
                <td><%= guest.stayDates.from.toLocaleDateString() %> - <%= guest.stayDates.to.toLocaleDateString() %></td>
            </tr>
            <tr>
                <th>ID Proof Number</th>
                <td><%= guest.idProofNumber %></td>
            </tr>
        </table>

        <p class="text-muted text-end">Downloaded on: <%= new Date().toLocaleString() %></p>

        <button class="btn btn-primary print-button" onclick="window.print()">Print</button>
    </div>
</body>

</html>

```

# views\index.ejs

```ejs
<div class="text-center">
    <h1 class="display-4 fw-bold mt-5 text-primary">Welcome to the Digital Guest Onboarding System</h1>
    <p class="lead mt-3 text-muted">Seamless registration and management for guests and administrators.</p>
    
    <% if (message) { %>
        <div class="alert alert-danger w-50 mx-auto"><%= message %></div>
    <% } %>

    <div class="mt-5">
        <a href="/guest/login" class="btn btn-lg btn-outline-primary mx-2">Guest Login</a>
        <a href="/guest/signup" class="btn btn-lg btn-outline-success mx-2">Guest Signup</a>
        <a href="/admin/login" class="btn btn-lg btn-outline-secondary mx-2">Admin Login</a>
    </div>
</div>
```

# views\layout.ejs

```ejs
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Digital Guest Onboarding</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet">
    <link rel="stylesheet" href="/public/styles.css">
    <style>
        body {
            background-color: #f8f9fa;
        }

        .navbar {
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .feature-section {
            background-color: #ffffff;
            padding: 50px 20px;
            margin-top: 50px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .feature-section h2 {
            text-align: center;
            margin-bottom: 40px;
            font-weight: bold;
        }

        .feature-item {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .feature-item:hover {
            transform: translateY(-10px);
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
        }

        .feature-item .icon {
            font-size: 2.5rem;
            color: #007bff;
            margin-bottom: 15px;
        }

        .cta-section {
            background: linear-gradient(45deg, #007bff, #6610f2);
            color: #ffffff;
            text-align: center;
            padding: 50px 20px;
            border-radius: 10px;
            margin-top: 50px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .cta-section h2 {
            font-size: 2.5rem;
            margin-bottom: 20px;
        }

        .cta-section p {
            font-size: 1.2rem;
            margin-bottom: 30px;
        }

        .cta-section .btn {
            padding: 15px 30px;
            font-size: 1rem;
            border-radius: 50px;
        }

        footer {
            background-color: #343a40;
            color: #fff;
            padding: 15px 0;
        }

        footer a {
            color: #adb5bd;
            text-decoration: none;
        }

        footer a:hover {
            color: #fff;
        }
    </style>
</head>

<body>
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
        <div class="container-fluid">
            <a class="navbar-brand" href="/">Guest Onboarding</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <% if (user) { %>
                        <li class="nav-item">
                            <a class="nav-link"
                                href="<%= user.role === 'admin' ? '/admin/dashboard' : '/guest/admin/panel' %>">Home</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="<%= user.role === 'admin' ? '/admin/logout' : '/guest/logout' %>">Logout</a>
                        </li>
                    <% } else { %>
                        <li class="nav-item">
                            <a class="nav-link" href="/guest/login">Guest Login</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="/guest/signup">Guest Signup</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="/admin/login">Admin Login</a>
                        </li>
                    <% } %>
                </ul>
            </div>
        </div>
    </nav>

    <div class="container mt-5">
        <%- body %>
    </div>

    <div class="container feature-section">
        <h2>What We Offer</h2>
        <div class="row">
            <div class="col-md-4">
                <div class="feature-item text-center">
                    <div class="icon"><i class="fas fa-user-check"></i></div>
                    <h4>Effortless Registration</h4>
                    <p>Register with ease, and start your journey without the hassle of paperwork.</p>
                </div>
            </div>
            <div class="col-md-4">
                <div class="feature-item text-center">
                    <div class="icon"><i class="fas fa-lock"></i></div>
                    <h4>Secure Login</h4>
                    <p>Your personal data is always safe with our advanced security measures.</p>
                </div>
            </div>
            <div class="col-md-4">
                <div class="feature-item text-center">
                    <div class="icon"><i class="fas fa-concierge-bell"></i></div>
                    <h4>24/7 Support</h4>
                    <p>Our team is available round-the-clock to assist with any concerns or needs.</p>
                </div>
            </div>
        </div>
    </div>

    <div class="cta-section">
        <h2>Ready to Get Started?</h2>
        <p>Join our digital guest onboarding system and experience hassle-free registration and management.</p>
        <a href="/guest/signup" class="btn btn-lg btn-light">Sign Up Now</a>
        <a href="/guest/login" class="btn btn-lg btn-dark">Login</a>
    </div>

    <footer class="text-center mt-5">
        <p>&copy; <%= new Date().getFullYear() %> Digital Guest Onboarding System. All rights reserved.</p>
        <p>
            <a href="/">Home</a> | 
            <a href="/guest/login">Guest Login</a> | 
            <a href="/admin/login">Admin Login</a>
        </p>
    </footer>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>

</html>
```

