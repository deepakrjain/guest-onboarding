require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');

// Initialize app first
const app = express();

// Set EJS as the template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Use express-ejs-layouts
app.use(expressLayouts);
app.set('layout', 'layout'); // Default layout file

const connectDB = require('./config/db');
// Connect to MongoDB
connectDB();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use('/public', express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
    res.render('index', { pageTitle: 'Welcome to the Digital Guest Onboarding System' });
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
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));