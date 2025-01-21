# app.js

```js
// app.js
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const app = express();

// Middleware and Static File Serving
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
// Ensure bodyParser middleware is applied
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// View Engine Setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layout');

// Session Configuration
app.use(session({
    secret: process.env.SESSION_SECRET || '1067',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Global Middleware for User and Flash Messages
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

// Database Connection and Server Start
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
    })
    .catch((err) => {
        console.error('Database connection error:', err);
        process.exit(1);
    });

module.exports = app;
```


file structure:-
DigitalGuestOnboarding/
├── controllers/        # Business logic (e.g., hotel, guest)
│   ├── adminController.js
│   ├── guestController.js
├── middleware/        
│   ├── authMiddleware.js
├── models/             # MongoDB schemas
│   ├── hotel.js
│   ├── guest.js
│   ├── admin.js
├── routes/             # Express routes
│   ├── adminRoutes.js
│   ├── guestRoutes.js
├── public/             # Static files
│   ├── scripts/
│   │   ├── validation.js
│   ├── styles.css
├── views/              # EJS templates
│   ├── admin/
│   │   ├── dashboard.ejs
│   │   ├── guestDetails.ejs
│   │   ├── editGuest.ejs
│   │   ├── login.ejs
│   │   ├── hotels.ejs
│   ├── guest/
│   │   ├── form.ejs
│   │   ├── thankyou.ejs
├── .env                # Environment variables
├── app.js              # Main server file
└── package.json        # Node.js dependencies


/.env:
--------------------------------------------------------------------------------
1 | MONGO_URI=mongodb://localhost:27017/DigitalGuestOnboarding
2 | JWT_SECRET=1067

--------------------------------------------------------------------------------
/public/styles.css:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/deepakrjain/guest-onboarding/298f09830fb03f5fb471d014f0588e5b834ec63a/public/styles.css


--------------------------------------------------------------------------------
/testBcrypt.js:
--------------------------------------------------------------------------------
1 | const bcrypt = require('bcrypt');
2 | 
3 | bcrypt.hash('password123', 10)
4 |   .then(hash => {
5 |     console.log('Hashed Password:', hash);
6 |   })
7 |   .catch(err => {
8 |     console.error('Error:', err);
9 |   });


--------------------------------------------------------------------------------

```

# config\db.js

```js
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected successfully!');
    } catch (err) {
        console.error('MongoDB connection error:', err);
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

// Main Admin Dashboard
exports.dashboard = async (req, res) => {
    try {
        const hotels = await Hotel.find();
        const hotelsWithStats = await Promise.all(
            hotels.map(async (hotel) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const [todayGuests, totalGuests] = await Promise.all([
                    Guest.countDocuments({
                        hotel: hotel._id,
                        'stayDates.from': { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) }
                    }),
                    Guest.countDocuments({ hotel: hotel._id })
                ]);
                return { ...hotel.toObject(), todayGuests, totalGuests };
            })
        );

        res.render('admin/dashboard', {
            pageTitle: 'Admin Dashboard',
            hotels: hotelsWithStats,
            guests: await Guest.find()
        });
    } catch (error) {
        console.error('Error loading dashboard:', error);
        res.status(500).render('index', {
            pageTitle: 'Error',
            message: 'An error occurred while loading the dashboard'
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
    const { name, address } = req.body;
    const logo = req.file.path; // Assuming file upload is handled
    const newHotel = await Hotel.create({ name, address, logo });
    
    // Generate QR code for hotel-specific landing page
    const qrCode = await QRCode.toDataURL(`http://localhost:3000/hotels/${newHotel.id}`);
    newHotel.qrCode = qrCode;
    await newHotel.save();
    
    res.redirect('/admin/hotels');
};

exports.getHotels = async (req, res) => {
    const hotels = await Hotel.findAll(); // Fetch from database
    res.render('admin/hotels', { hotels });
};

exports.deleteHotel = async (req, res) => {
    try {
        const hotel = await Hotel.findById(req.params.id);
        
        if (!hotel) {
            return res.status(404).json({ message: 'Hotel not found' });
        }

        // Delete associated files
        if (hotel.logo) {
            fs.unlink(`public/uploads/${hotel.logo}`, err => {
                if (err) console.error('Error deleting logo:', err);
            });
        }

        // Delete associated guests
        await Guest.deleteMany({ hotel: hotel._id });

        await hotel.remove();
        
        res.json({ success: true });
    } catch (error) {
        console.error(error);
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
```

# controllers\authController.js

```js
const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');
const bcrypt = require('bcryptjs');

// Login function that uses res.render
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

        // Redirect based on role
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
```

# controllers\guestController.js

```js
const Guest = require('../models/guest');
const Hotel = require('../models/hotel');
const { validationResult } = require('express-validator');

exports.showForm = async (req, res) => {
    try {
        const { hotelId } = req.params;

        if (!hotelId) {
            return res.status(400).render('guest/form', {
                hotel: null, 
                pageTitle: 'Guest Registration',
                errors: [{ msg: 'Hotel not specified' }],
                formData: {}
            });
        }

        const hotel = await Hotel.findById(hotelId);

        if (!hotel) {
            return res.status(404).render('guest/form', {
                hotel: null, 
                pageTitle: 'Guest Registration',
                errors: [{ msg: 'Hotel not found' }],
                formData: {}
            });
        }

        res.render('guest/form', {
            hotel,
            pageTitle: `Guest Registration - ${hotel.name}`,
            errors: [],
            formData: {}
        });
    } catch (error) {
        console.error('Error showing guest form:', error);
        res.status(500).render('guest/form', {
            hotel: null, 
            pageTitle: 'Guest Registration',
            errors: [{ msg: 'An unexpected error occurred. Please try again later.' }],
            formData: {}
        });
    }
};

exports.getGuests = (req, res) => {
    // Logic to fetch guests from the database
    res.render('guests', { guests: [] });
};

exports.submitForm = async (req, res) => {
    try {
        const hotel = await Hotel.findById(req.params.hotelId);
        if (!hotel) {
            return res.status(404).render('index', {
                pageTitle: 'Hotel Not Found',
                message: 'The requested hotel could not be found.'
            });
        }

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render('guest/form', {
                hotel,
                pageTitle: `Welcome to ${hotel.name}`,
                formData: req.body,
                errors: errors.array()
            });
        }

        const guest = new Guest({
            hotel: hotel._id,
            fullName: req.body.fullName,
            mobileNumber: req.body.mobileNumber,
            email: req.body.email,
            address: req.body.address,
            purpose: req.body.purpose,
            stayDates: {
                from: req.body.stayDates.from,
                to: req.body.stayDates.to
            },
            idProofNumber: req.body.idProofNumber
        });

        await guest.save();

        res.render('guest/thankyou', {
            pageTitle: 'Registration Successful',
            guest,
            hotel
        });
    } catch (err) {
        console.error('Error submitting guest form:', err);
        res.render('index', {
            pageTitle: 'Error',
            message: 'An error occurred while processing your registration. Please try again.'
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
        └── thankyou.ejs
    └── index.ejs
    └── layout.ejs
```

# middleware\authMiddleware.js

```js
const jwt = require('jsonwebtoken');

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).render('admin/login', {
                error: 'Access Denied. Please log in.',
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('JWT Verification Error:', error);
        res.status(403).render('admin/login', {
            error: 'Invalid or expired token. Please log in again.',
        });
    }
};

// Middleware to check for MainAdmin role
const isMainAdmin = (req, res, next) => {
    if (req.user.role !== 'MainAdmin') {
        return res.status(403).json({ message: 'Access Denied. Admin privileges required.' });
    }
    next();
};

// Middleware to check for GuestAdmin role
const isGuestAdmin = (req, res, next) => {
    if (req.user.role !== 'GuestAdmin') {
        return res.status(403).json({ message: 'Access Denied. Guest Admin privileges required.' });
    }
    next();
};

module.exports = { verifyToken, isMainAdmin, isGuestAdmin };
```

# middleware\uploadMiddleware.js

```js
// middleware/uploadMiddleware.js
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
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

module.exports = upload;
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
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
        type: String, 
        enum: ['mainAdmin', 'guestAdmin'], 
        required: true 
    },
    hotel: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Hotel',
        required: function() { return this.role === 'guestAdmin'; }
    },
    email: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now }
});

// Hash password before saving
adminSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Method to compare password
adminSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Admin', adminSchema);
```

# models\guest.js

```js
// models/guest.js
const mongoose = require('mongoose');

const guestSchema = new mongoose.Schema({
    hotel: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Hotel', 
        required: true 
    },
    fullName: { 
        type: String, 
        required: true,
        trim: true
    },
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
        required: true 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
}, {
    timestamps: true
});

// Validation for stay dates
guestSchema.pre('save', function(next) {
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
  logo: { type: String, required: true },
  address: { type: String, required: true },
  qrCode: { type: String }, // Path to QR code image
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

# routes\adminRoutes.js

```js
const express = require('express');
const router = express.Router();
const generateQRCode = require('../utils/qrCode');
const Hotel = require('../models/hotel');
const adminController = require('../controllers/adminController');
const authController = require('../controllers/authController');
const { verifyToken, isMainAdmin, isGuestAdmin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { hotelValidationRules, validate } = require('../middleware/validationMiddleware');

// Auth routes
router.post('/admin/login', authController.login);
router.get('/login', (req, res) => res.render('admin/login'));

// Login route with error handling
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Attempt login using authController.login
        const user = await authController.login(username, password);

        if (user) {
            // If login successful, redirect to the dashboard
            res.redirect('/admin/dashboard');
        } else {
            // If authentication fails, pass error message to the login page
            res.render('admin/login', { error: 'Invalid username or password' });
        }
    } catch (error) {
        // Log and pass the error to the login page
        console.error('Login error:', error);
        res.render('admin/login', { error: 'An error occurred during login' });
    }
});

// Logout route
router.get('/logout', authController.logout);

// Protected routes
router.use(verifyToken);

// Main admin routes
router.use('/hotels', isMainAdmin);
router.get('/hotels', adminController.getHotels);
router.post(
    '/hotels',
    upload.single('logo'), // Handles file upload for the "logo" field
    hotelValidationRules,
    validate,
    async (req, res) => {
        try {
            const { name, address } = req.body;
            const logo = req.file.filename; // The uploaded file's name
            const qrCodeUrl = `${process.env.BASE_URL}/guest/form?hotelId=${name}`;
            const qrCode = await generateQRCode(qrCodeUrl);

            const hotel = new Hotel({ name, address, logo, qrCode });
            await hotel.save();

            res.redirect('/admin/dashboard');
        } catch (error) {
            console.error('Error adding hotel:', error);
            res.status(500).send('Internal Server Error');
        }
    }
);

router.get('/dashboard', isMainAdmin, adminController.dashboard);


// routes/adminRoutes.js

// Add these routes
router.delete('/hotels/:id', isMainAdmin, adminController.deleteHotel);
router.get('/search/guests', verifyToken, adminController.searchGuests);


// Guest admin routes
router.use('/guests', isGuestAdmin);
router.get('/guests', adminController.getGuests);
router.get('/guest/:id', adminController.viewGuest);
router.post('/guest/edit/:id', adminController.editGuest);
router.get('/guest-dashboard', isGuestAdmin, adminController.guestDashboard);

// Register guest admin (main admin only)
router.post('/register-guest-admin', isMainAdmin, authController.registerGuestAdmin);

module.exports = router;
```

# routes\guestRoutes.js

```js
const express = require('express');
const router = express.Router();
const guestController = require('../controllers/guestController');
const Hotel = require('../models/hotel');

router.get('/form', async (req, res) => {
    const hotels = await Hotel.find(); // Fetch all hotels
    if (hotels.length === 1) {
        // Redirect to the only hotel's form if only one hotel exists
        return res.redirect(`/guest/form/${hotels[0]._id}`);
    }

    res.render('guest/form', { 
        hotel: null, 
        pageTitle: 'Guest Registration',
        errors: [],
        formData: {}
    });
});
// Static route to render the guest registration form
router.get('/form/:hotelId', guestController.showForm);

// Route to submit the registration form
router.post('/form', guestController.submitForm);

// Route to get the list of guests (Admin)
router.get('/guests', guestController.getGuests);
router.post('/guests', guestController.addGuest);
// Dynamic route to show the form for a specific hotel
router.get('/:hotelId', guestController.showForm);
router.post('/:hotelId', guestController.submitForm);

module.exports = router;
```

# testBcrypt.js

```js
const bcrypt = require('bcrypt');

bcrypt.hash('password123', 10)
  .then(hash => {
    console.log('Hashed Password:', hash);
  })
  .catch(err => {
    console.error('Error:', err);
  });
```

# utils\qrCode.js

```js
const QRCode = require('qrcode');

const generateQRCode = async (url) => {
    try {
        return await QRCode.toDataURL(url);
    } catch (error) {
        console.error('QR Code Generation Error:', error);
        throw error;
    }
};

module.exports = generateQRCode;
```

# views\admin\dashboard.ejs

```ejs
<header>
    <h1>Admin Dashboard</h1>
</header>
<main>
    <!-- views/admin/dashboard.ejs -->
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
                    <h2><%= guests.length %></h2>
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
    <form action="/admin/guest/edit/<%= guest._id %>" method="POST">
        <div class="mb-3">
            <label for="fullName" class="form-label">Full Name</label>
            <input type="text" class="form-control" id="fullName" name="fullName" value="<%= guest.fullName %>"
                required>
        </div>
        <div class="mb-3">
            <label for="mobile" class="form-label">Mobile Number</label>
            <input type="text" class="form-control" id="mobile" name="mobile" value="<%= guest.mobile %>" required>
        </div>
        <div class="mb-3">
            <label for="purpose" class="form-label">Purpose of Visit</label>
            <select class="form-control" id="purpose" name="purpose" required>
                <option value="Business" <%=guest.purpose==='Business' ? 'selected' : '' %>>Business</option>
                <option value="Personal" <%=guest.purpose==='Personal' ? 'selected' : '' %>>Personal</option>
                <option value="Tourist" <%=guest.purpose==='Tourist' ? 'selected' : '' %>>Tourist</option>
            </select>
        </div>
        <div class="mb-3">
            <label for="fromDate" class="form-label">Stay Dates (From)</label>
            <input type="date" class="form-control" id="fromDate" name="fromDate" value="<%= guest.fromDate %>"
                required>
        </div>
        <div class="mb-3">
            <label for="toDate" class="form-label">Stay Dates (To)</label>
            <input type="date" class="form-control" id="toDate" name="toDate" value="<%= guest.toDate %>" required>
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

<h1>Manage Hotels</h1>
<form method="POST" action="/admin/add-hotel" enctype="multipart/form-data">
    <div class="mb-3">
        <input type="text" name="name" class="form-control" placeholder="Hotel Name" required />
    </div>
    <div class="mb-3">
        <input type="text" name="address" class="form-control" placeholder="Address" required />
    </div>
    <div class="mb-3">
        <input type="file" name="logo" class="form-control" />
    </div>
    <button type="submit" class="btn btn-primary">Add Hotel</button>
</form>
<table class="table mt-4">
    <thead>
        <tr>
            <th>Name</th>
            <th>Address</th>
            <th>Logo</th>
            <th>QR Code</th>
        </tr>
    </thead>
    <tbody>
        <% hotels.forEach(hotel => { %>
            <tr>
                <td><%= hotel.name %></td>
                <td><%= hotel.address %></td>
                <td><img src="/uploads/<%= hotel.logo %>" alt="Logo" width="50" /></td>
                <td><img src="<%= hotel.qrCode %>" alt="QR Code" width="50" /></td>
            </tr>
        <% }) %>
    </tbody>
</table>
```

# views\admin\login.ejs

```ejs

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
        <p style="color: red;"><%= error %></p>
    <% } %>
</form>
```

# views\admin\viewGuest.ejs

```ejs

<h2>Guest Details</h2>
<p><strong>Full Name:</strong> <%= guest.fullName %></p>
<p><strong>Mobile:</strong> <%= guest.mobile %></p>
<p><strong>Purpose of Visit:</strong> <%= guest.purpose %></p>
<p><strong>Stay Dates:</strong> <%= guest.fromDate %> - <%= guest.toDate %></p>
<p><strong>Email:</strong> <%= guest.email %></p>
<button onclick="window.print()" class="btn btn-secondary">Print</button>
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
                                    <% }); %>
                                </ul>
                            </div>
                        <% } %>

                        <form method="POST" action="<%= hotel ? `/guest/${hotel._id}` : '#' %>">
                            <div class="mb-3">
                                <label for="fullName" class="form-label">Full Name</label>
                                <input type="text" class="form-control" id="fullName" name="fullName" 
                                       value="<%= typeof formData !== 'undefined' ? formData.fullName : '' %>" required>
                            </div>

                            <div class="mb-3">
                                <label for="mobileNumber" class="form-label">Mobile Number</label>
                                <input type="tel" class="form-control" id="mobileNumber" name="mobileNumber" 
                                       pattern="[0-9]{10}" value="<%= typeof formData !== 'undefined' ? formData.mobileNumber : '' %>" required>
                            </div>

                            <div class="mb-3">
                                <label for="email" class="form-label">Email</label>
                                <input type="email" class="form-control" id="email" name="email" 
                                       value="<%= typeof formData !== 'undefined' ? formData.email : '' %>" required>
                            </div>

                            <div class="mb-3">
                                <label for="address" class="form-label">Address</label>
                                <textarea class="form-control" id="address" name="address" rows="3" required><%= typeof formData !== 'undefined' ? formData.address : '' %></textarea>
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
                                    <input type="date" class="form-control" id="fromDate" name="stayDates[from]" 
                                           min="<%= new Date().toISOString().split('T')[0] %>" 
                                           value="<%= typeof formData !== 'undefined' ? formData.stayDates?.from : '' %>" required>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label for="toDate" class="form-label">Check-out Date</label>
                                    <input type="date" class="form-control" id="toDate" name="stayDates[to]" 
                                           value="<%= typeof formData !== 'undefined' ? formData.stayDates?.to : '' %>" required>
                                </div>
                            </div>

                            <div class="mb-3">
                                <label for="idProofNumber" class="form-label">ID Proof Number</label>
                                <input type="text" class="form-control" id="idProofNumber" name="idProofNumber" 
                                       value="<%= typeof formData !== 'undefined' ? formData.idProofNumber : '' %>" required>
                            </div>

                            <button type="submit" class="btn btn-primary w-100">Submit Registration</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="/public/scripts/validation.js"></script>
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
    <div>
        <a href="/guest/form" class="btn btn-primary">Guest Registration</a>
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

