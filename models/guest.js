const mongoose = require('mongoose');

const guestSchema = new mongoose.Schema({
    hotelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true },
    fullName: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    address: { type: String, required: true },
    purpose: { type: String, required: true },
    fromDate: { type: Date, required: true },
    toDate: { type: Date, required: true },
    email: { type: String, required: true },
    idProof: { type: String, required: true },
});

module.exports = mongoose.model('Guest', guestSchema);