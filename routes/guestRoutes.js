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