require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo'); // <--- NEW: Import connect-mongo
const app = express();
const connectDB = require('./config/db');

// Middleware and Static File Serving
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layout');

// <--- NEW: Trust the proxy (essential for Render)
app.set('trust proxy', 1); // Trust first proxy (Render's proxy)

// Session Configuration
app.use(session({
    secret: process.env.JWT_SECRET || 'a_very_secret_key_for_session',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ // <--- NEW: Use MongoStore
        mongoUrl: process.env.MONGODB_URI,
        collectionName: 'sessions', // Optional: specify a collection name for sessions
        ttl: 14 * 24 * 60 * 60, // Session TTL in seconds (14 days)
        autoRemove: 'interval',
        autoRemoveInterval: 10 // In minutes. Removes expired sessions every 10 minutes
    }),
    cookie: {
        secure: process.env.NODE_ENV === 'production', // Must be true in production (HTTPS)
        httpOnly: true, // Prevent client-side JS from reading the cookie
        maxAge: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
        sameSite: 'lax' // Recommended for security and cross-site requests
    }
}));

// Global Middleware to make user and messages available in EJS
app.use((req, res, next) => {
    res.locals.user = null;
    res.locals.error = req.session.error || null;
    res.locals.success = req.session.success || null;
    next();
});

// This block is redundant and can be removed as res.locals.user is set above
// and req.session.guest/user are checked by auth middleware.
// app.use((req, res, next) => {
//     if (req.session.guest) {
//         res.locals.user = { id: req.session.guest.id, role: 'guestAdmin' };
//     } else if (req.session.user) {
//         res.locals.user = { id: req.session.user.id, role: req.session.user.role };
//     } else {
//         res.locals.user = null;
//     }
//     next();
// });

// Routes
app.get('/', (req, res) => {
    if (req.session.user && req.session.user.role === 'admin') {
        return res.redirect('/admin/dashboard');
    }
    if (req.session.guest) {
        return res.redirect('/guest/admin/panel');
    }
    res.render('index', {
        pageTitle: 'Digital Guest Onboarding System',
        message: res.locals.error || res.locals.success || null
    });
});
app.use('/guest', require('./routes/guestRoutes'));
app.use('/admin', require('./routes/adminRoutes'));

// Error Handling Middleware (catch-all for unhandled errors)
app.use((err, req, res, next) => {
    console.error('Application Error:', err.stack || err.message || err);
    req.session.error = err.message || 'An unexpected error occurred.';
    res.status(err.status || 500).redirect('/');
});

// 404 Handler (for routes not found)
app.use((req, res) => {
    req.session.error = 'Page not found.';
    res.status(404).redirect('/');
});

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();

module.exports = app;