const express = require('express');
const router = express.Router();
const guestController = require('../controllers/guestController');

router.get('/:hotelId', guestController.showForm);
router.post('/:hotelId', guestController.submitForm);

const { verifyToken, isGuestAdmin } = require('../middleware/authMiddleware');

router.get('/guests', guestController.getGuests);
router.get('/form/:id', guestController.getGuestForm);
router.post('/submit', guestController.submitGuestForm);

module.exports = router;