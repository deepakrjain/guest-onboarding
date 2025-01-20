// models/guest.js
const mongoose = require('mongoose');

const guestSchema = new mongoose.Schema({
    hotel: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Hotel', 
        required: true 
    },
    fullName: { 
        type: String, 
        required: true,
        trim: true
    },
    mobileNumber: { 
        type: String, 
        required: true,
        match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit mobile number']
    },
    address: { 
        type: String, 
        required: true 
    },
    purpose: { 
        type: String, 
        required: true,
        enum: ['Business', 'Personal', 'Tourist']
    },
    stayDates: {
        from: { 
            type: Date, 
            required: true 
        },
        to: { 
            type: Date, 
            required: true 
        }
    },
    email: { 
        type: String, 
        required: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
    },
    idProofNumber: { 
        type: String, 
        required: true 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
}, {
    timestamps: true
});

// Validation for stay dates
guestSchema.pre('save', function(next) {
    if (this.stayDates.from > this.stayDates.to) {
        next(new Error('Check-out date must be after check-in date'));
    }
    next();
});

module.exports = mongoose.model('Guest', guestSchema);