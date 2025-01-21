const Guest = require('../models/guest');
const Hotel = require('../models/hotel');
const { validationResult } = require('express-validator');

exports.showForm = async (req, res) => {
    try {
        const hotels = await Hotel.find(); // Fetch all hotels

        if (!hotels.length) {
            return res.status(404).render('guest/form', {
                hotel: null,
                pageTitle: 'Guest Registration',
                errors: [{ msg: 'No hotels available for registration.' }],
                formData: {},
                hotels: [] // Pass empty hotels array
            });
        }

        res.render('guest/form', {
            pageTitle: 'Guest Registration',
            errors: [],
            formData: {},
            hotels: hotels // Pass the hotels array to the form
        });
    } catch (error) {
        console.error('Error fetching hotels for registration form:', error);
        res.status(500).render('guest/form', {
            pageTitle: 'Guest Registration',
            errors: [{ msg: 'An unexpected error occurred.' }],
            formData: {},
            hotels: [] // Handle error with empty hotels array
        });
    }
};

exports.getGuests = (req, res) => {
    // Logic to fetch guests from the database
    res.render('guests', { guests: [] });
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