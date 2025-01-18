const Guest = require('../models/guest');
const Hotel = require('../models/hotel');

// Display Guest Form
const getGuestForm = async (req, res) => {
    try {
        const hotel = await Hotel.findById(req.params.hotelId);
        res.render('guest/form', { hotel });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

// Handle Guest Form Submission
const submitGuestForm = async (req, res) => {
    try {
        const { fullName, mobile, address, purpose, stayFrom, stayTo, email, idProofNumber } = req.body;
        const guest = new Guest({
            hotelId: req.params.hotelId,
            fullName,
            mobile,
            address,
            purpose,
            stayDates: { from: stayFrom, to: stayTo },
            email,
            idProofNumber,
        });
        await guest.save();

        res.render('guest/thankyou', { fullName });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

// Placeholder for View Guests
const viewGuests = (req, res) => {
    res.send('View Guests - Functionality not implemented yet.');
};

// Export all controllers
module.exports = {
    getGuestForm,
    submitGuestForm,
    viewGuests,
};