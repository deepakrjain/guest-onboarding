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