const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    username: String,
    password: String,
    role: String
}, { collection: 'users' });  // explicitly specify the collection name

module.exports = mongoose.model('User', adminSchema);