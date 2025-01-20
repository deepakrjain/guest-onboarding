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