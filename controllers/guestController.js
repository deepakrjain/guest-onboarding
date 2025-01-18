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