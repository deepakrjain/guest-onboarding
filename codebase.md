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

// View Engine Setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layout');

// Session Configuration
app.use(session({
    secret: '1067',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } 
}));

// Global Middleware
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    res.locals.error = null;
    res.locals.success = null;
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

// Initialize Database and Start Server
const startServer = async () => {
    try {
        await connectDB();
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();

module.exports = app;
```

file structure:-
DigitalGuestOnboarding/
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


/.env:
--------------------------------------------------------------------------------
1 | MONGO_URI=mongodb://localhost:27017/DigitalGuestOnboarding
2 | JWT_SECRET=1067



# config\db.js

```js
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/guestOnboarding");
        console.log('MongoDB connected successfully!');
    } catch (err) {
        console.error('MongoDB connection error:', err.message);
        process.exit(1); // Exit with failure
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
```

# controllers\authController.js

```js
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
```

# controllers\guestController.js

```js
const bcrypt = require('bcrypt');
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
        const hotels = await Hotel.find();
        if (!hotels.length) {
            return res.status(404).render('guest/form', {
                pageTitle: 'No Hotels Available',
                errors: [{ msg: 'No hotels available at the moment.' }],
                formData: {},
                hotels: [], // Empty array to indicate no hotels
            });
        }

        // Pass hotels array to form.ejs
        res.render('guest/form', {
            pageTitle: 'Available Hotels',
            errors: [],
            formData: {},
            hotels, // Pass the list of hotels
        });
    } catch (error) {
        console.error('Error fetching hotels:', error);
        res.status(500).render('guest/form', {
            pageTitle: 'Error',
            errors: [{ msg: 'An error occurred while fetching the hotel list.' }],
            formData: {},
            hotels: [], // Empty array on error
        });
    }
};

exports.showForm = async (req, res) => {
    try {
        const hotelId = req.params.hotelId || req.query.hotelId; // Get hotel ID from params or query
        const hotel = await Hotel.findById(hotelId); // Fetch specific hotel
        const hotels = await Hotel.find(); // Fetch all hotels

        if (!hotel) {
            return res.status(404).render('guest/form', {
                hotel: null,
                pageTitle: 'Guest Registration',
                errors: [{ msg: 'Selected hotel not found.' }],
                formData: {},
                hotels: hotels || [] // Pass the hotels array
            });
        }

        res.render('guest/form', {
            pageTitle: 'Guest Registration',
            errors: [],
            formData: {}, // Empty form data
            hotels: hotels, // All hotels for dropdown
            hotel: hotel // Pass the specific hotel to prepopulate form
        });
    } catch (error) {
        console.error('Error showing guest form:', error);
        res.status(500).render('guest/form', {
            pageTitle: 'Error',
            errors: [{ msg: 'An unexpected error occurred.' }],
            formData: {},
            hotels: [], // Handle error with empty hotels array
        });
    }
};

// Guest login
exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const guest = await Guest.findOne({ username });
        if (!guest) {
            return res.render('guest/login', { error: 'Invalid username or password' });
        }
        const isMatch = await bcrypt.compare(password, guest.password);
        if (!isMatch) {
            return res.render('guest/login', { error: 'Invalid username or password' });
        }
        req.session.guest = { id: guest._id, username: guest.username };
        res.redirect('/guest/hotels');
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).render('guest/login', { error: 'Internal server error' });
    }
};

// Guest signup
exports.signup = async (req, res) => {
    const { username, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.render('guest/signup', { errors: [{ msg: 'Passwords do not match' }] });
    }

    try {
        const existingGuest = await Guest.findOne({ username });
        if (existingGuest) {
            return res.render('guest/signup', { errors: [{ msg: 'Username already taken' }] });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newGuest = new Guest({
            username,
            password: hashedPassword,
            fullName: 'Guest', // Default name for signup
            mobileNumber: '0000000000', // Default mobile number
            address: 'N/A', // Default address
            purpose: 'Personal', // Default purpose
            stayDates: {
                from: new Date(), // Default current date
                to: new Date(), // Default current date
            },
            email: `${username}@example.com`, // Default email based on username
            idProofNumber: '0000', // Default value for ID proof
            hotel: null, // Can be updated later in the guest admin panel
        });

        await newGuest.save();

        res.redirect('/guest/login');
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).render('guest/signup', { errors: [{ msg: 'Internal server error' }] });
    }
};


exports.getGuests = async (req, res) => {
    try {
        const guests = await Guest.find({ hotel: req.params.id });
        const hotel = await Hotel.findById(req.params.id);

        res.render('guest/adminPanel', { guests, hotel });
    } catch (error) {
        console.error('Error fetching guests:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.viewGuest = async (req, res) => {
    try {
        const guest = await Guest.findById(req.params.id).populate('hotel'); // Fetch guest and hotel details
        if (!guest) {
            return res.status(404).render('admin/guestDetails', {
                pageTitle: 'Guest Not Found',
                message: 'The guest details you are looking for do not exist.',
            });
        }
        res.render('admin/viewGuest', { guest });
    } catch (error) {
        console.error('Error fetching guest details:', error);
        res.status(500).render('index', {
            pageTitle: 'Error',
            message: 'An error occurred while fetching guest details.',
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

// Update guest's details after editing
exports.editGuest = async (req, res) => {
    try {
        const { fullName, mobileNumber, purpose, stayDates, email } = req.body;
        const updatedGuest = await Guest.findByIdAndUpdate(req.params.guestId, {
            fullName,
            mobileNumber,
            purpose,
            stayDates,
            email,
        }, { new: true });

        if (!updatedGuest) {
            return res.status(404).render('admin/guestDetails', {
                pageTitle: 'Guest Not Found',
                message: 'Unable to find guest for editing.',
            });
        }

        res.redirect('/admin/guests');
    } catch (error) {
        console.error('Error editing guest:', error);
        res.status(500).render('index', {
            pageTitle: 'Error',
            message: 'An error occurred while editing the guest details.',
        });
    }
};


exports.submitForm = async (req, res) => {
    try {
        const { from, to } = req.body.stayDates;
        const errors = validationResult(req);

        // Date validation
        if (new Date(from) >= new Date(to)) {
            errors.errors.push({ msg: 'Checkout date must be after check-in date' });
        }

        if (!errors.isEmpty()) {
            const hotels = await Hotel.find();
            return res.render('guest/form', {
                pageTitle: 'Guest Registration',
                formData: req.body,
                errors: errors.array(),
                hotels,
            });
        }

        const guest = new Guest({
            hotel: req.body.hotel,
            fullName: req.body.fullName.trim(),
            mobileNumber: req.body.mobileNumber.trim(),
            email: req.body.email.trim(),
            address: req.body.address.trim(),
            purpose: req.body.purpose,
            stayDates: {
                from: req.body.stayDates.from,
                to: req.body.stayDates.to,
            },
            idProofNumber: req.body.idProofNumber.trim(),
        });

        await guest.save();

        res.render('guest/thankyou', {
            pageTitle: 'Registration Successful',
            fullName: guest.fullName,
        });
    } catch (err) {
        console.error('Guest form submission error:', err.message);
        res.status(500).render('index', {
            pageTitle: 'Error',
            message: 'An error occurred while submitting the form. Please try again.',
        });
    }
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

const adminSchema = new mongoose.Schema({
    username: String,
    password: String,
    role: String
}, { collection: 'users' });  // explicitly specify the collection name

module.exports = mongoose.model('User', adminSchema);
```

# models\guest.js

```js
// models/guest.js
const mongoose = require('mongoose');

const guestSchema = new mongoose.Schema({
    hotel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hotel',
        required: false
    },
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    mobileNumber: {
        type: String,
        required: true,
        match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit mobile number']
    },
    address: {
        type: String,
        required: true
    },
    purpose: {
        type: String,
        required: true,
        enum: ['Business', 'Personal', 'Tourist']
    },
    stayDates: {
        from: {
            type: Date,
            required: true
        },
        to: {
            type: Date,
            required: true
        }
    },
    email: {
        type: String,
        required: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
    },
    idProofNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 4,
        maxlength: 20,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
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
    "bcrypt": "^5.1.1",
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

# routes\adminRoutes.js

```js
//adminRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const adminController = require('../controllers/adminController');
const guestController = require('../controllers/guestController');
const Hotel = require('../models/hotel');
const Guest = require('../models/guest');
const { verifyToken } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public routes

router.get('/login', (req, res) => {
    if (req.user) {
        // Redirect to dashboard if the admin is already logged in
        return res.redirect('/admin/dashboard');
    }
    res.render('admin/login', { error: null });
});

router.post('/login', authController.login);
router.get('/logout', authController.logout);

// Protected routes
router.use(verifyToken);
router.get('/dashboard', verifyToken, async (req, res) => {
    try {
        // Fetch hotels from the database
        const hotels = await Hotel.find();

        // Get total number of guests
        const totalGuests = await Guest.countDocuments();

        // Get today's check-ins
        const today = new Date();
        today.setHours(0, 0, 0, 0);  // Set time to start of the day
        const todayCheckIns = await Guest.countDocuments({
            'stayDates.from': { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) }
        });

        // Get guest data for the dashboard
        const guests = await Guest.find().limit(10); // Example: fetching 10 guests (you can change the limit)

        // Pass the fetched data to the view
        res.render('admin/dashboard', {
            user: req.user,  // User info from token
            pageTitle: 'Admin Dashboard',
            hotels,
            guests,
            totalGuests,
            todayCheckIns
        });
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.redirect('/admin/login');
    }
});

router.post('/hotels/:id/delete', adminController.deleteHotel);

router.get('/guests', guestController.getGuests); // List all guests
router.get('/edit-guest/:guestId', guestController.getGuestDetails); // Edit guest details
router.post('/edit-guest/:guestId', guestController.editGuest); // Handle editing guest
router.get('/hotels', adminController.getHotels);
router.post('/add-hotel', upload, adminController.addHotel);
router.get('/hotels/:hotelId/guests', adminController.getGuests);

module.exports = router;
```

# routes\guestRoutes.js

```js
const express = require('express');
const router = express.Router();
const guestController = require('../controllers/guestController');
const Hotel = require('../models/hotel');


router.post('/login', guestController.login);
router.post('/signup', guestController.signup);

router.get('/form', async (req, res) => {
    const hotels = await Hotel.find(); // Fetch all hotels
    if (hotels.length === 1) {
        // Redirect to the only hotel's form if only one hotel exists
        return res.redirect(`/guest/form/${hotels[0]._id}`); // Fixed URL
    }

    res.render('guest/form', { 
        hotel: null, 
        pageTitle: 'Guest Registration',
        errors: [],
        formData: {},
        hotels: hotels
    });
});
// Static route to render the guest registration form
router.get('/form/:hotelId', guestController.showForm);

// Route to submit the registration form
router.post('/form', guestController.submitForm);

// Route to get the list of guests (Admin)
router.get('/guests', guestController.getGuests);
router.post('/guests', guestController.addGuest);

// List of hotels and hotel details
router.get('/hotels', guestController.listHotels);
router.get('/hotel/:id', guestController.hotelDetails);

router.get('/login', (req, res) => res.render('guest/login', { error: null }));
router.post('/login', guestController.login);

// Guest signup routes
router.get('/signup', (req, res) => res.render('guest/signup', { errors: [] }));
router.post('/signup', guestController.signup);

// Guest admin panel
// router.get('/admin', guestController.adminPanel);
router.get('/admin/guest/:id', guestController.viewGuest);
router.post('/admin/guest/:id/edit', guestController.editGuest);

// Dynamic route to show the form for a specific hotel
router.get('/:hotelId', guestController.showForm);
router.post('/:hotelId', guestController.submitForm);

router.get('/', (req, res) => res.render('index', { error: null })); // Home page shows guest login

module.exports = router;
```

# utils\qrCode.js

```js
const QRCode = require('qrcode');

exports.generateQRCode = async (hotelId) => {
    const baseUrl = 'http://192.168.29.1:3000'; // Replace with your LAN IP for testing on mobile
    const hotelUrl = `${baseUrl}/guest/hotel/${hotelId}`; // Hotel landing page
    try {
        const qrCode = await QRCode.toDataURL(hotelUrl);
        return qrCode; // Return base64 QR code string
    } catch (error) {
        console.error('Error generating QR code:', error);
        throw error;
    }
};

module.exports = generateQRCode;
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
                        <h2><%= hotels.length %></h2>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card bg-success text-white mb-4">
                    <div class="card-body">
                        <h5 class="card-title">Total Guests</h5>
                        <h2><%= totalGuests %></h2>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card bg-info text-white mb-4">
                    <div class="card-body">
                        <h5 class="card-title">Today's Check-ins</h5>
                        <h2><%= todayCheckIns %></h2>
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
                                    <% hotels.forEach(hotel => { %>
                                        <tr>
                                            <td><%= hotel.name %></td>
                                            <td><%= hotel.todayGuests || 0 %></td>
                                            <td><%= hotel.totalGuests || 0 %></td>
                                            <td>
                                                <a href="/admin/hotels/<%= hotel._id %>" class="btn btn-sm btn-info">View</a>
                                                <a href="/admin/hotels/<%= hotel._id %>/guests" class="btn btn-sm btn-primary">Guests</a>
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
<form action="/admin/edit-guest/<%= guest._id %>" method="POST">
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
<h1>Guest Details</h1>
<table class="table">
    <thead>
        <tr>
            <th>Name</th>
            <th>Mobile</th>
            <th>Purpose</th>
            <th>Actions</th>
        </tr>
    </thead>
    <tbody>
        <% guests.forEach(guest => { %>
            <tr>
                <td><%= guest.fullName %></td>
                <td><%= guest.mobileNumber %></td>
                <td><%= guest.purpose %></td>
                <td>
                    <a href="/admin/edit-guest/<%= guest._id %>" class="btn btn-primary btn-sm">Edit</a>
                </td>
            </tr>
        <% }) %>
    </tbody>
</table>
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
                                <% hotels.forEach(hotel=> { %>
                                    <tr>
                                        <td>
                                            <%= hotel.name %>
                                        </td>
                                        <td>
                                            <%= hotel.address %>
                                        </td>
                                        <td>
                                            <img src="/uploads/<%= hotel.logo %>" alt="Logo" style="height: 50px;">
                                        </td>
                                        <td>
                                            <img src="<%= hotel.qrCode %>" alt="QR Code" style="height: 50px;">
                                        </td>
                                        <td>
                                            <a href="/admin/hotels/<%= hotel._id %>/guests"
                                                class="btn btn-sm btn-info">View Guests</a>
                                            <!-- Delete Button -->
                                            <form action="/admin/hotels/<%= hotel._id %>/delete" method="POST"
                                                style="display:inline;">
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
    <h2 class="mb-4">Guests for <%= hotel.name %></h2>
    <table class="table table-bordered">
        <thead>
            <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            <% guests.forEach(guest => { %>
                <tr>
                    <td><%= guest.fullName %></td>
                    <td><%= guest.email %></td>
                    <td><%= guest.mobileNumber %></td>
                    <td>
                        <a href="/guest/admin/guest/<%= guest._id %>/view" class="btn btn-info btn-sm">View</a>
                        <a href="/guest/admin/guest/<%= guest._id %>/edit" class="btn btn-warning btn-sm">Edit</a>
                    </td>
                </tr>
            <% }) %>
        </tbody>
    </table>
</div>
```

# views\guest\form.ejs

```ejs
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Guest Registration</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="/public/styles.css">
</head>

<body>
    <% if (hotels && hotels.length) { %>
        <div class="container mt-4">
            <h2 class="text-center mb-4">Available Hotels</h2>
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
                                <a href="/guest/hotel/<%= hotel._id %>" class="btn btn-primary">View Details</a>
                            </td>
                        </tr>
                    <% }) %>
                </tbody>
            </table>
        </div>
    <% } else { %>
        <div class="container mt-4">
            <div class="row justify-content-center">
                <div class="col-md-8">
                    <div class="card">
                        <div class="card-header text-center">
                            <% if (hotel) { %>
                                <img src="/uploads/<%= hotel.logo %>" alt="<%= hotel.name %> Logo" class="img-fluid mb-2" style="max-height: 100px;">
                                <h2><%= hotel.name %></h2>
                                <p class="text-muted"><%= hotel.address %></p>
                            <% } else { %>
                                <h2>Guest Registration</h2>
                            <% } %>
                        </div>
                        <div class="card-body">
                            <% if (typeof errors !== 'undefined' && errors.length > 0) { %>
                                <div class="alert alert-danger">
                                    <ul class="mb-0">
                                        <% errors.forEach(function(error) { %>
                                            <li><%= error.msg %></li>
                                        <% }) %>
                                    </ul>
                                </div>
                            <% } %>
                            <form method="POST" action="<%= hotel ? `/guest/form/${hotel._id}` : '#' %>">
                                <div class="mb-3">
                                    <label for="fullName" class="form-label">Full Name</label>
                                    <input type="text" class="form-control" id="fullName" name="fullName" value="<%= typeof formData !== 'undefined' ? formData.fullName : '' %>" required>
                                </div>
                                <div class="mb-3">
                                    <label for="mobileNumber" class="form-label">Mobile Number</label>
                                    <input type="tel" class="form-control" id="mobileNumber" name="mobileNumber" pattern="[0-9]{10}" value="<%= typeof formData !== 'undefined' ? formData.mobileNumber : '' %>" required>
                                </div>
                                <div class="mb-3">
                                    <label for="email" class="form-label">Email</label>
                                    <input type="email" class="form-control" id="email" name="email" value="<%= typeof formData !== 'undefined' ? formData.email : '' %>" required>
                                </div>
                                <div class="mb-3">
                                    <label for="address" class="form-label">Address</label>
                                    <textarea class="form-control" id="address" name="address" rows="3" required><%= typeof formData !== 'undefined' ? formData.address : '' %></textarea>
                                </div>
                                <div class="mb-3">
                                    <label for="hotel" class="form-label">Select Hotel</label>
                                    <% if (hotel) { %>
                                        <input type="text" class="form-control" value="<%= hotel.name %>" disabled>
                                        <input type="hidden" name="hotel" value="<%= hotel._id %>">
                                    <% } else { %>
                                        <select class="form-control" id="hotel" name="hotel" required>
                                            <option value="">Select a Hotel</option>
                                            <% if (hotels && hotels.length > 0) { %>
                                                <% hotels.forEach(hotel => { %>
                                                    <option value="<%= hotel._id %>"><%= hotel.name %></option>
                                                <% }) %>
                                            <% } else { %>
                                                <option disabled>No hotels available</option>
                                            <% } %>
                                        </select>
                                    <% } %>
                                </div>                                
                                <div class="mb-3">
                                    <label for="purpose" class="form-label">Purpose of Visit</label>
                                    <select class="form-control" id="purpose" name="purpose" required>
                                        <option value="">Select Purpose</option>
                                        <option value="Business" <%= typeof formData !== 'undefined' && formData.purpose === 'Business' ? 'selected' : '' %>>Business</option>
                                        <option value="Personal" <%= typeof formData !== 'undefined' && formData.purpose === 'Personal' ? 'selected' : '' %>>Personal</option>
                                        <option value="Tourist" <%= typeof formData !== 'undefined' && formData.purpose === 'Tourist' ? 'selected' : '' %>>Tourist</option>
                                    </select>
                                </div>
                                <div class="row">
                                    <div class="col-md-6 mb-3">
                                        <label for="fromDate" class="form-label">Check-in Date</label>
                                        <input type="date" class="form-control" id="fromDate" name="stayDates[from]" min="<%= new Date().toISOString().split('T')[0] %>" value="<%= typeof formData !== 'undefined' ? formData.stayDates?.from : '' %>" required>
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <label for="toDate" class="form-label">Check-out Date</label>
                                        <input type="date" class="form-control" id="toDate" name="stayDates[to]" value="<%= typeof formData !== 'undefined' ? formData.stayDates?.to : '' %>" required>
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label for="idProofNumber" class="form-label">ID Proof Number</label>
                                    <input type="text" class="form-control" id="idProofNumber" name="idProofNumber" value="<%= typeof formData !== 'undefined' ? formData.idProofNumber : '' %>" required>
                                </div>
                                <button type="submit" class="btn btn-primary w-100">Submit Registration</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    <% } %>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="/public/scripts/validation.js"></script>
</body>

</html>
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
                <a href="/guest/form/<%= hotel._id %>?hotelId=<%= hotel._id %>" class="btn btn-primary">Book Now</a>
            </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>

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
        <% if (errors && errors.length > 0) { %>
            <div class="alert alert-danger">
                <ul>
                    <% errors.forEach(error => { %>
                        <li><%= error.msg %></li>
                    <% }); %>
                </ul>
            </div>
        <% } %>
        <form action="/guest/signup" method="POST">
            <div class="mb-3">
                <label for="username" class="form-label">Username</label>
                <input type="text" id="username" name="username" class="form-control" required>
            </div>
            <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input type="password" id="password" name="password" class="form-control" required>
            </div>
            <div class="mb-3">
                <label for="confirmPassword" class="form-label">Confirm Password</label>
                <input type="password" id="confirmPassword" name="confirmPassword" class="form-control" required>
            </div>
            <button type="submit" class="btn btn-primary w-100">Sign Up</button>
        </form>
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

# views\index.ejs

```ejs
<div class="text-center">
    <h1>Welcome to the Digital Guest Onboarding System</h1>
    <% if (message) { %>
        <div class="alert alert-danger"><%= message %></div>
    <% } %>
    <div class="mt-4">
        <a href="/guest/login" class="btn btn-primary">Guest Login</a>
        <a href="/guest/signup" class="btn btn-success">Guest Signup</a>
        <a href="/admin/login" class="btn btn-secondary">Admin Login</a>
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
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="/public/styles.css">
</head>
<body>
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
        <div class="container"> 
            <a class="navbar-brand" href="/">Guest Onboarding</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item"><a class="nav-link" href="/">Home</a></li>
                    <li class="nav-item"><a class="nav-link" href="/guest/form">Guest Registration</a></li>
                    <li class="nav-item"><a class="nav-link" href="/admin/login">Admin Login</a></li>
                </ul>
            </div>
        </div>
    </nav>
    <div class="container mt-4">
        <%- body %>
    </div>
    <footer class="text-center mt-4">
        <p>&copy; 2025 Digital Guest Onboarding System</p>
    </footer>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
```

