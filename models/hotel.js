const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    logo: { type: String, required: true },
    qrCode: { type: String, required: true },
});

module.exports = mongoose.model('Hotel', hotelSchema);