const express = require('express');
const router = express.Router();
const guestController = require('../controllers/guestController');
const Hotel = require('../models/hotel'); // Ensure this is properly imported

// Guest form routes
router.get('/:hotelId', guestController.showForm);
router.post('/:hotelId', guestController.submitForm);

// Guest list and form routes
router.get('/guests', guestController.getGuests);
router.get('/form', async (req, res) => {
    try {
        const { hotelId } = req.query;
        const hotel = await Hotel.findById(hotelId);
        if (!hotel) {
            return res.status(404).send('Hotel not found');
        }
        res.render('guest/form', { hotel });
    } catch (error) {
        console.error('Error loading guest form:', error);
        res.status(500).send('Internal Server Error');
    }
});
router.post('/form', guestController.submitForm); // Use correct method here

module.exports = router;