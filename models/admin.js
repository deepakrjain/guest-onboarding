const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Ensure bcryptjs is imported

const adminSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'admin' }
}, { collection: 'users', timestamps: true });

adminSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10); // Generate a salt
        this.password = await bcrypt.hash(this.password, salt); // Hash the password
    }
    next();
});

module.exports = mongoose.model('Admin', adminSchema);