const Guest = require('../models/guest');
const Hotel = require('../models/hotel');

exports.showForm = async (req, res) => {
    try {
        const hotel = await Hotel.findById(req.params.hotelId);
        if (!hotel) return res.status(404).send('Hotel not found');

        res.render('guest/form', { hotel });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};


exports.getGuests = async (req, res) => {
    try {
        const guests = await Guest.find({ hotelId: req.admin.hotelId });
        res.render('admin/guestDetails', { guests });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

exports.submitForm = async (req, res) => {
    try {
        const { fullName, mobileNumber, address, purpose, stayDates, email, idProof } = req.body;

        const guest = new Guest({
            hotelId: req.params.hotelId,
            fullName,
            mobileNumber,
            address,
            purpose,
            stayDates,
            email,
            idProof,
        });
        await guest.save();

        res.render('guest/thankyou', { guest });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

// Export all controllers
module.exports = {
    showForm,
    submitForm,
    getGuests,
};