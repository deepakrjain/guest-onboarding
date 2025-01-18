const express = require('express');
const router = express.Router();
const guestController = require('../controllers/guestController');

// Guest Routes
router.get('/:hotelId', guestController.getGuestForm);  
router.post('/:hotelId', guestController.submitGuestForm);

const { verifyToken, isGuestAdmin } = require('../middleware/authMiddleware');

router.get('/guests', verifyToken, isGuestAdmin, guestController.viewGuests);
router.get('/form/:id', guestController.getGuestForm);
router.post('/submit', guestController.submitGuestForm);

module.exports = router;