// app.js
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const app = express();

// Middleware and Static File Serving
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
// Ensure bodyParser middleware is applied
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// View Engine Setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layout');

// Session Configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Global Middleware for User and Flash Messages
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    res.locals.error = null;
    res.locals.success = null;
    next();
});

// Routes
app.get('/', (req, res) => {
    res.render('index', { 
        pageTitle: 'Digital Guest Onboarding System',
        message: null 
    });
});
app.use('/guest', require('./routes/guestRoutes'));
app.use('/admin', require('./routes/adminRoutes'));

// Error Handling
app.use((err, req, res, next) => {
    console.error('Error:', err.message || err);
    res.status(err.status || 500).render('index', {
        pageTitle: 'Error',
        message: err.message || 'An unexpected error occurred.'
    });
});

// 404 Handler
app.use((req, res) => {
    res.status(404).render('index', {
        pageTitle: '404 Not Found',
        message: 'Page not found'
    });
});

// Database Connection and Server Start
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
    })
    .catch((err) => {
        console.error('Database connection error:', err);
        process.exit(1);
    });

module.exports = app;