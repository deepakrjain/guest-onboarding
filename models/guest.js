const mongoose = require('mongoose');

const guestSchema = new mongoose.Schema({
    hotelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true },
    fullName: { type: String, required: true },
    mobile: { type: String, required: true },
    address: { type: String, required: true },
    purpose: { type: String, enum: ['Business', 'Personal', 'Tourist'], required: true },
    stayDates: { from: Date, to: Date },
    email: { type: String, required: true },
    idProofNumber: { type: String, required: true },
});

module.exports = mongoose.model('Guest', guestSchema);