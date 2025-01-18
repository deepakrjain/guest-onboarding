require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

// Initialize app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use('/public', express.static(path.join(__dirname, 'public')));

// Set View Engine
app.set('view engine', 'ejs');

app.get('/', async (req, res) => {
    res.send('Welcome to the Digital Guest Onboarding System!');
});

// MongoDB Connection (Single Call)
mongoose
    .connect(process.env.MONGO_URI || 'mongodb://localhost:27017/digitalGuestOnboarding', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('MongoDB Connected');
    })
    .catch((err) => {
        console.error('Failed to connect to MongoDB:', err);
    });

// Routes
app.use('/admin', require('./routes/adminRoutes'));
app.use('/guest', require('./routes/guestRoutes'));

// Start Server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));