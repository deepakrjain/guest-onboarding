const express = require('express');
const router = express.Router();
const guestController = require('../controllers/guestController');
const Hotel = require('../models/hotel');

// Static route to render the guest registration form
router.get('/form', async (req, res) => {
    try {
        const hotels = await Hotel.find(); // Fetch all hotels for dropdown selection
        res.render('guest/form', { hotels, pageTitle: 'Guest Registration' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

// Route to submit the registration form
router.post('/form', guestController.submitForm);

// Route to get the list of guests (Admin)
router.get('/guests', guestController.getGuests);

// Dynamic route to show the form for a specific hotel
router.get('/:hotelId', guestController.showForm);
router.post('/:hotelId', guestController.submitForm);

module.exports = router;