const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    logo: { type: String }, // File path for logo
    qrCode: { type: String } // File path for QR code
});

module.exports = mongoose.model('Hotel', hotelSchema);