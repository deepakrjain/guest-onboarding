const express = require('express');
const router = express.Router();
const guestController = require('../controllers/guestController');
const Hotel = require('../models/hotel');

// Guest login and signup
router.get('/', guestController.showLogin);

router.get('/login', guestController.showLogin);
router.post('/login', guestController.login);
router.get('/signup', guestController.showSignup);
router.post('/signup', guestController.signup);

// Route for listing all hotels
router.get('/hotels', guestController.listHotels);

// Route for viewing hotel details
router.get('/hotel/:id', guestController.hotelDetails);

// Route for the guest registration form for a specific hotel
router.get('/form/:hotelId', guestController.showForm);
router.post('/form/:hotelId', guestController.submitForm);

// Guest form routes
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
router.get('/form/:hotelId', guestController.showForm);
router.post('/form/:hotelId', guestController.submitForm);

// Hotel routes for guests
router.get('/hotels', guestController.listHotels);
router.get('/hotel/:id', guestController.hotelDetails);

// Guest admin panel
router.get('/admin/guests/:hotelId', guestController.getGuests);
router.get('/admin/edit-guest/:guestId', guestController.getGuestDetails);
router.post('/admin/edit-guest/:guestId', guestController.editGuest);

module.exports = router;