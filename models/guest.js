const mongoose = require('mongoose'); // Import mongoose

const guestSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fullName: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    address: { type: String, required: true },
    purpose: { type: String, required: true },
    stayDates: {
        from: { type: Date, required: true },
        to: { type: Date, required: true },
    },
    idProofNumber: { type: String, required: true, unique: true },
    hotel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true },
});


// Validation for stay dates
guestSchema.pre('save', function (next) {
    if (this.stayDates.from > this.stayDates.to) {
        next(new Error('Check-out date must be after check-in date'));
    }
    next();
});

module.exports = mongoose.model('Guest', guestSchema);