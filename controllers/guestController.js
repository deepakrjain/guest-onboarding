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
        const guestId = req.session.guest?.id;

        if (!guestId) {
            return res.status(400).render('guest/adminPanel', {
                pageTitle: 'Guest Admin Panel',
                error: 'Guest not logged in. Please log in again.',
                guests: [],
                hotel: null,
            });
        }

        const guest = await Guest.findById(guestId).populate('hotel');
        if (!guest) {
            return res.status(404).render('guest/adminPanel', {
                pageTitle: 'Guest Admin Panel',
                error: 'Guest details not found.',
                guests: [],
                hotel: null,
            });
        }

        const hotel = guest.hotel;
        const guests = await Guest.find({ _id: guestId });

        res.render('guest/adminPanel', {
            pageTitle: `Guest Admin Panel - ${hotel.name}`,
            hotel,
            guests,
            error: null,
        });
    } catch (error) {
        console.error('Error loading guest admin panel:', error);
        res.status(500).render('guest/adminPanel', {
            pageTitle: 'Guest Admin Panel',
            error: 'An error occurred while loading the guest admin panel.',
            guests: [],
            hotel: null,
        });
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
        const { fullName, mobileNumber, purpose, stayDates, email } = req.body;
        
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
        }, { new: true });

        if (!updatedGuest) {
            return res.status(404).render('admin/guestDetails', {
                pageTitle: 'Guest Not Found',
                message: 'Unable to find guest for editing.',
            });
        }

        res.redirect('/guest/admin/panel');
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
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const hotel = await Hotel.findById(req.params.hotelId);
            if (!hotel) {
                return res.status(404).send('Hotel not found');
            }
            return res.render('guest/registerForm', {
                pageTitle: `Register at ${hotel.name}`,
                hotel,
                formData: req.body,
                errors: errors.array()
            });
        }

        const { fullName, mobileNumber, email, address, purpose, stayDates, idProofNumber } = req.body;

        const username = `guest_${Date.now()}`;
        const existingGuest = await Guest.findOne({ idProofNumber });
        if (existingGuest) {
            throw new Error('A guest with the same ID proof already exists');
        }

        const guest = new Guest({
            hotel: req.params.hotelId,
            fullName,
            username,
            mobileNumber,
            email,
            address,
            purpose,
            stayDates: {
                from: stayDates.from,
                to: stayDates.to
            },
            idProofNumber
        });

        await guest.save();
        res.render('guest/thankyou', {
            pageTitle: 'Registration Successful',
            fullName: guest.fullName
        });
    } catch (err) {
        console.error('Guest form submission error:', err.message);
        const hotel = await Hotel.findById(req.params.hotelId);
        res.status(500).render('guest/registerForm', {
            pageTitle: 'Error',
            hotel,
            formData: req.body,
            errors: [{ msg: err.message }]
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