const express = require('express');
const router = express.Router();
const guestController = require('../controllers/guestController');
const Hotel = require('../models/hotel');

router.post('/login', guestController.login);
router.post('/signup', guestController.signup);

router.get('/form', async (req, res) => {
    const hotels = await Hotel.find();
    if (hotels.length === 1) {
        return res.redirect(`/guest/form/${hotels[0]._id}`);
    }
    res.render('guest/form', {
        hotel: null,
        pageTitle: 'Guest Registration',
        errors: [],
        formData: {},
        hotels
    });
});

// Dynamic hotel form route
router.get('/form/:hotelId', guestController.showForm);
router.post('/form/:hotelId', guestController.submitForm);

// Guest admin-specific routes
router.get('/admin/guests/:hotelId', guestController.getGuests);
router.get('/admin/edit-guest/:guestId', guestController.getGuestDetails);
router.post('/admin/edit-guest/:guestId', guestController.editGuest);

// Guest landing page
router.get('/hotels', guestController.listHotels);
router.get('/hotel/:id', guestController.hotelDetails);

router.get('/', (req, res) => res.render('guest/login', { error: null }));
router.post('/login', guestController.login);

router.get('/edit-guest/:guestId', guestController.getGuestDetails); // Edit guest details
router.post('/edit-guest/:guestId', guestController.editGuest); // Handle editing guest

module.exports = router;