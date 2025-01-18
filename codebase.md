# app.js

```js
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

// Initialize app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use('/public', express.static(path.join(__dirname, 'public')));

// Set View Engine
app.set('view engine', 'ejs');

app.get('/', async (req, res) => {
    res.send('Welcome to the Digital Guest Onboarding System!');
});

// MongoDB Connection (Single Call)
mongoose
    .connect(process.env.MONGO_URI || 'mongodb://localhost:27017/digitalGuestOnboarding', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('MongoDB Connected');
    })
    .catch((err) => {
        console.error('Failed to connect to MongoDB:', err);
    });

// Routes
app.use('/admin', require('./routes/adminRoutes'));
app.use('/guest', require('./routes/guestRoutes'));

// Start Server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
```

/.env:
--------------------------------------------------------------------------------
1 | MONGO_URI=mongodb://localhost:27017/DigitalGuestOnboarding
2 | JWT_SECRET=1067

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

# controllers\adminController.js

```js
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

// View Hotels

exports.getHotels = async (req, res) => {
    try {
        const hotels = await Hotel.find();
        res.render('admin/hotels', { hotels });
    } catch (error) {
        console.error('Error fetching hotels:', error);
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
```

# controllers\authController.js

```js
const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');
const bcrypt = require('bcryptjs');

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Find admin
        const admin = await Admin.findOne({ email }).populate('hotel');
        if (!admin) {
            return res.render('admin/login', {
                error: 'Invalid credentials',
                email
            });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.render('admin/login', {
                error: 'Invalid credentials',
                email
            });
        }

        // Generate JWT
        const token = jwt.sign(
            { 
                id: admin._id,
                role: admin.role,
                hotelId: admin.hotel?._id 
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });

        // Redirect based on role
        if (admin.role === 'mainAdmin') {
            res.redirect('/admin/dashboard');
        } else {
            res.redirect('/admin/guest-dashboard');
        }

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

exports.showForm = async (req, res) => {
    try {
        const hotel = await Hotel.findById(req.params.hotelId);
        if (!hotel) return res.status(404).send('Hotel not found');

        res.render('guest/form', { 
            hotel,
            pageTitle: `Welcome to ${hotel.name}`,
            formData: {} // For re-populating form on validation errors
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

exports.submitForm = async (req, res) => {
    try {
        const { 
            fullName, 
            mobileNumber, 
            address, 
            purpose, 
            fromDate,
            toDate,
            email, 
            idProof 
        } = req.body;

        const hotelId = req.params.hotelId || req.query.hotelId;
        const hotel = await Hotel.findById(hotelId);
        if (!hotel) return res.status(404).send('Hotel not found');

        const guest = new Guest({
            hotel: hotelId,
            fullName,
            mobileNumber,
            address,
            purpose,
            stayDates: {
                from: fromDate,
                to: toDate
            },
            email,
            idProofNumber: idProof
        });

        await guest.save();
        res.render('guest/thankyou', { 
            guest,
            pageTitle: 'Thank You'
        });
    } catch (error) {
        console.error(error);
        const hotel = await Hotel.findById(req.params.hotelId || req.query.hotelId);
        res.render('guest/form', { 
            hotel,
            pageTitle: `Welcome to ${hotel.name}`,
            formData: req.body,
            error: 'Error submitting form. Please try again.'
        });
    }
};

exports.getGuests = async (req, res) => {
    try {
        const hotelId = req.admin.hotelId;
        const guests = await Guest.find({ hotel: hotelId })
                                .sort('-createdAt');
        res.render('admin/guestDetails', { 
            guests,
            pageTitle: 'Guest Details'
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};
```

# fileStructure.txt

```txt
DigitalGuestOnboarding/
├── controllers/        # Business logic (e.g., hotel, guest)
│   ├── adminController.js
│   ├── guestController.js
├── middleware/        
│   ├── authMiddleware.js
│   ├── uploadMiddleware.js  (for handling file uploads)
│   ├── validationMiddleware.js  (for form validation)
├── models/             # MongoDB schemas
│   ├── hotel.js
│   ├── guest.js
│   ├── admin.js
├── routes/             # Express routes
│   ├── adminRoutes.js
│   ├── guestRoutes.js
├── utils/ 
│   ├── qrCode.js
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
```

# middleware\authMiddleware.js

```js
const jwt = require('jsonwebtoken');

// Middleware to verify JWT
exports.verifyToken = (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Access Denied. Please log in.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(403).json({ message: 'Invalid or expired token.' });
    }
};

// Middleware to check for MainAdmin role
exports.isMainAdmin = (req, res, next) => {
    if (req.user.role !== 'MainAdmin') {
        return res.status(403).json({ message: 'Access Denied. Admin privileges required.' });
    }
    next();
};

// Middleware to check for GuestAdmin role
exports.isGuestAdmin = (req, res, next) => {
    if (req.user.role !== 'GuestAdmin') {
        return res.status(403).json({ message: 'Access Denied. Guest Admin privileges required.' });
    }
    next();
};
```

# middleware\uploadMiddleware.js

```js
// middleware/uploadMiddleware.js
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Not an image! Please upload an image.'), false);
    }
};

exports.upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 5 // 5MB limit
    }
});
```

# middleware\validationMiddleware.js

```js
// middleware/validationMiddleware.js
const { body, validationResult } = require('express-validator');

exports.guestValidationRules = [
    body('fullName').notEmpty().trim().withMessage('Full name is required')
        .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
    body('mobile').notEmpty().withMessage('Mobile number is required')
        .matches(/^[0-9]{10}$/).withMessage('Please enter a valid 10-digit mobile number'),
    body('email').isEmail().withMessage('Please enter a valid email address'),
    body('purpose').isIn(['Business', 'Personal', 'Tourist']).withMessage('Invalid purpose selected'),
    body('address').notEmpty().withMessage('Address is required'),
    body('idProofNumber').notEmpty().withMessage('ID proof number is required')
];

exports.hotelValidationRules = [
    body('name').notEmpty().trim().withMessage('Hotel name is required')
        .isLength({ min: 2, max: 100 }).withMessage('Hotel name must be between 2 and 100 characters'),
    body('address').notEmpty().withMessage('Address is required')
];

exports.validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
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
const mongoose = require('mongoose');

const guestSchema = new mongoose.Schema({
    hotelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true },
    fullName: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    address: { type: String, required: true },
    purpose: { type: String, required: true },
    fromDate: { type: Date, required: true },
    toDate: { type: Date, required: true },
    email: { type: String, required: true },
    idProof: { type: String, required: true },
});

module.exports = mongoose.model('Guest', guestSchema);
```

# models\hotel.js

```js
const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    logo: { type: String, required: true },
    qrCode: { type: String, required: true },
});

module.exports = mongoose.model('Hotel', hotelSchema);
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
    "dotenv": "^16.4.7",
    "ejs": "^3.1.10",
    "express": "^4.21.2",
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
const { upload } = require('../middleware/uploadMiddleware');
const { hotelValidationRules, validate } = require('../middleware/validationMiddleware');

// Auth routes
router.get('/login', (req, res) => res.render('admin/login'));
router.post('/login', authController.login);
router.get('/logout', authController.logout);

// Protected routes
router.use(verifyToken);

// Main admin routes
router.use('/hotels', isMainAdmin);
router.get('/hotels', adminController.getHotels);
router.post(
    '/hotels',
    upload.single('logo'),
    hotelValidationRules,
    validate,
    async (req, res) => {
        try {
            const { name, address } = req.body;
            const logo = req.file.filename;
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
const Hotel = require('../models/hotel'); // Ensure this is properly imported

// Guest form routes
router.get('/:hotelId', guestController.showForm);
router.post('/:hotelId', guestController.submitForm);

// Guest list and form routes
router.get('/guests', guestController.getGuests);
router.get('/form', async (req, res) => {
    try {
        const { hotelId } = req.query;
        const hotel = await Hotel.findById(hotelId);
        if (!hotel) {
            return res.status(404).send('Hotel not found');
        }
        res.render('guest/form', { hotel });
    } catch (error) {
        console.error('Error loading guest form:', error);
        res.status(500).send('Internal Server Error');
    }
});
router.post('/form', guestController.submitForm); // Use correct method here

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
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Guest Admin Dashboard</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="/public/styles.css">
</head>
<body>
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
        <div class="container">
            <a class="navbar-brand" href="#">Hotel Guest Management</a>
            <div class="collapse navbar-collapse">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item">
                        <span class="nav-link">Welcome, <%= admin.username %></span>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/admin/logout">Logout</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <div class="container">
        <div class="row mb-4">
            <div class="col">
                <h2>Guest Management - <%= hotel.name %></h2>
            </div>
        </div>

        <div class="row mb-4">
            <div class="col-md-4">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Total Guests</h5>
                        <h2 class="card-text"><%= guestCount %></h2>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Today's Check-ins</h5>
                        <h2 class="card-text"><%= todayCheckIns %></h2>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Today's Check-outs</h5>
                        <h2 class="card-text"><%= todayCheckOuts %></h2>
                    </div>
                </div>
            </div>
        </div>

        <div class="card">
            <div class="card-body">
                <h5 class="card-title mb-4">Recent Guests</h5>
                <div class="table-responsive">
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Mobile</th>
                                <th>Purpose</th>
                                <th>Check-in</th>
                                <th>Check-out</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <% guests.forEach(guest => { %>
                                <tr>
                                    <td><%= guest.fullName %></td>
                                    <td><%= guest.mobile %></td>
                                    <td><%= guest.purpose %></td>
                                    <td><%= guest.stayDates.from.toLocaleDateString() %></td>
                                    <td><%= guest.stayDates.to.toLocaleDateString() %></td>
                                    <td>
                                        <a href="/admin/guest/view/<%= guest._id %>" class="btn btn-sm btn-info">View</a>
                                        <a href="/admin/guest/edit/<%= guest._id %>" class="btn btn-sm btn-primary">Edit</a>
                                    </td>
                                </tr>
                            <% }) %>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
```

# views\admin\editGuest.ejs

```ejs
<form action="/admin/guest/edit/<%= guest._id %>" method="POST">
    <div class="mb-3">
        <label for="fullName" class="form-label">Full Name</label>
        <input type="text" class="form-control" id="fullName" name="fullName" value="<%= guest.fullName %>" required>
    </div>
    <div class="mb-3">
        <label for="mobile" class="form-label">Mobile Number</label>
        <input type="text" class="form-control" id="mobile" name="mobile" value="<%= guest.mobile %>" required>
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
        <input type="date" class="form-control" id="fromDate" name="fromDate" value="<%= guest.fromDate %>" required>
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
<table>
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
                    <a href="/admin/edit-guest/<%= guest._id %>">Edit</a>
                </td>
            </tr>
        <% }) %>
    </tbody>
</table>
```

# views\admin\hotels.ejs

```ejs
<!DOCTYPE html>
<html lang="en">

<head>
    <title>Admin Dashboard</title>
    <link rel="stylesheet" href="/public/styles.css">
</head>

<body>
    <h1>Manage Hotels</h1>
    <form method="POST" action="/admin/add-hotel" enctype="multipart/form-data">
        <input type="text" name="name" placeholder="Hotel Name" required />
        <input type="text" name="address" placeholder="Address" required />
        <input type="file" name="logo" />
        <button type="submit">Add Hotel</button>
    </form>
    <table>
        <thead>
            <tr>
                <th>Name</th>
                <th>Address</th>
                <th>Logo</th>
                <th>QR Code</th>
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
                    <td><img src="/uploads/<%= hotel.logo %>" alt="Logo" width="50" /></td>
                    <td><img src="<%= hotel.qrCode %>" alt="QR Code" width="50" /></td>
                </tr>
                <% }) %>
        </tbody>
    </table>

    <script src="/public/scripts/validation.js"></script>
</body>

</html>
```

# views\admin\login.ejs

```ejs
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Admin Login</title>
    <link rel="stylesheet" href="/public/styles.css">
</head>
<body>
    <h1>Admin Login</h1>
    <form method="POST" action="/admin/login">
        <input type="email" name="email" placeholder="Email" required />
        <input type="password" name="password" placeholder="Password" required />
        <button type="submit">Login</button>
    </form>
    
</body>
</html>
```

# views\admin\viewGuest.ejs

```ejs
<h2>Guest Details</h2>
<p><strong>Full Name:</strong> <%= guest.fullName %></p>
<p><strong>Mobile:</strong> <%= guest.mobile %></p>
<p><strong>Purpose of Visit:</strong> <%= guest.purpose %></p>
<p><strong>Stay Dates:</strong> <%= guest.fromDate %> - <%= guest.toDate %></p>
<p><strong>Email:</strong> <%= guest.email %></p>
<button onclick="window.print()">Print</button>
```

# views\guest\form.ejs

```ejs
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Guest Registration - <%= hotel.name %></title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="/public/styles.css">
</head>
<body>
    <div class="container mt-5">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card">
                    <div class="card-header text-center">
                        <% if (hotel.logo) { %>
                            <img src="<%= hotel.logo %>" alt="<%= hotel.name %> Logo" class="img-fluid mb-3" style="max-height: 100px;">
                        <% } %>
                        <h2>Welcome to <%= hotel.name %></h2>
                        <p class="text-muted"><%= hotel.address %></p>
                    </div>
                    <div class="card-body">
                        <% if (typeof error !== 'undefined') { %>
                            <div class="alert alert-danger"><%= error %></div>
                        <% } %>
                        
                        <form method="POST" action="/guest/<%= hotel._id %>" id="guestForm" class="needs-validation" novalidate>
                            <div class="mb-3">
                                <label for="fullName" class="form-label">Full Name *</label>
                                <input type="text" class="form-control" id="fullName" name="fullName" 
                                    value="<%= typeof formData !== 'undefined' ? formData.fullName : '' %>" required>
                                <div class="invalid-feedback">Please enter your full name</div>
                            </div>

                            <div class="mb-3">
                                <label for="mobileNumber" class="form-label">Mobile Number *</label>
                                <input type="tel" class="form-control" id="mobileNumber" name="mobileNumber" 
                                    pattern="[0-9]{10}" value="<%= typeof formData !== 'undefined' ? formData.mobileNumber : '' %>" required>
                                <div class="invalid-feedback">Please enter a valid 10-digit mobile number</div>
                            </div>

                            <div class="mb-3">
                                <label for="email" class="form-label">Email *</label>
                                <input type="email" class="form-control" id="email" name="email" 
                                    value="<%= typeof formData !== 'undefined' ? formData.email : '' %>" required>
                                <div class="invalid-feedback">Please enter a valid email address</div>
                            </div>

                            <div class="mb-3">
                                <label for="address" class="form-label">Address *</label>
                                <textarea class="form-control" id="address" name="address" rows="2" required><%= typeof formData !== 'undefined' ? formData.address : '' %></textarea>
                                <div class="invalid-feedback">Please enter your address</div>
                            </div>

                            <div class="mb-3">
                                <label for="purpose" class="form-label">Purpose of Visit *</label>
                                <select class="form-control" id="purpose" name="purpose" required>
                                    <option value="">Select Purpose</option>
                                    <option value="Business" <%= (typeof formData !== 'undefined' && formData.purpose === 'Business') ? 'selected' : '' %>>Business</option>
                                    <option value="Personal" <%= (typeof formData !== 'undefined' && formData.purpose === 'Personal') ? 'selected' : '' %>>Personal</option>
                                    <option value="Tourist" <%= (typeof formData !== 'undefined' && formData.purpose === 'Tourist') ? 'selected' : '' %>>Tourist</option>
                                </select>
                                <div class="invalid-feedback">Please select your purpose of visit</div>
                            </div>

                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label for="fromDate" class="form-label">Check-in Date *</label>
                                    <input type="date" class="form-control" id="fromDate" name="fromDate" 
                                        value="<%= typeof formData !== 'undefined' ? formData.fromDate : '' %>" required>
                                    <div class="invalid-feedback">Please select your check-in date</div>
                                </div>

                                <div class="col-md-6 mb-3">
                                    <label for="toDate" class="form-label">Check-out Date *</label>
                                    <input type="date" class="form-control" id="toDate" name="toDate" 
                                        value="<%= typeof formData !== 'undefined' ? formData.toDate : '' %>" required>
                                    <div class="invalid-feedback">Please select your check-out date</div>
                                </div>
                            </div>

                            <div class="mb-3">
                                <label for="idProof" class="form-label">ID Proof Number *</label>
                                <input type="text" class="form-control" id="idProof" name="idProof" 
                                    value="<%= typeof formData !== 'undefined' ? formData.idProof : '' %>" required>
                                <div class="invalid-feedback">Please enter your ID proof number</div>
                            </div>

                            <button type="submit" class="btn btn-primary w-100">Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="/public/scripts/validation.js"></script>
</body>
</html>
```

# views\guest\thankyou.ejs

```ejs
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Thank You</title>
    <link rel="stylesheet" href="/public/styles.css">
</head>
<body>
    <h1>Thank you, <%= fullName %>!</h1>
    <p>Your details have been successfully submitted.</p>
</body>
</html>
```