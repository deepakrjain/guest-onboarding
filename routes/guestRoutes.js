const express = require('express');
const router = express.Router();
const guestController = require('../controllers/guestController');
const Hotel = require('../models/hotel');


router.post('/login', guestController.login);
router.post('/signup', guestController.signup);

router.get('/form', async (req, res) => {
    const hotels = await Hotel.find(); // Fetch all hotels
    if (hotels.length === 1) {
        // Redirect to the only hotel's form if only one hotel exists
        return res.redirect(`/guest/form/${hotels[0]._id}`); // Fixed URL
    }

    res.render('guest/form', { 
        hotel: null, 
        pageTitle: 'Guest Registration',
        errors: [],
        formData: {},
        hotels: hotels
    });
});
// Static route to render the guest registration form
router.get('/form/:hotelId', guestController.showForm);

// Route to submit the registration form
router.post('/form', guestController.submitForm);

// Route to get the list of guests (Admin)
router.get('/guests', guestController.getGuests);
router.post('/guests', guestController.addGuest);

// List of hotels and hotel details
router.get('/hotels', guestController.listHotels);
router.get('/hotel/:id', guestController.hotelDetails);

router.get('/login', (req, res) => res.render('guest/login', { error: null }));
router.post('/login', guestController.login);

// Guest signup routes
router.get('/signup', (req, res) => res.render('guest/signup', { errors: [] }));
router.post('/signup', guestController.signup);

// Guest admin panel
// router.get('/admin', guestController.adminPanel);
router.get('/admin/guest/:id', guestController.viewGuest);
router.post('/admin/guest/:id/edit', guestController.editGuest);

// Dynamic route to show the form for a specific hotel
router.get('/:hotelId', guestController.showForm);
router.post('/:hotelId', guestController.submitForm);

router.get('/', (req, res) => res.render('index', { error: null })); // Home page shows guest login

module.exports = router;