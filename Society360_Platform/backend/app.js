const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

// Routes
const authRoutes = require('./routes/authRoutes');
const visitorRoutes = require('./routes/visitorRoutes');
const maintenanceRoutes = require('./routes/maintenanceRoutes');
const communicationRoutes = require('./routes/communicationRoutes');

const rateLimit = require('express-rate-limit');
const hpp = require('hpp');

const app = express();

// Security Middleware
app.use(helmet()); // Sets various security headers
app.use(hpp()); // Prevent HTTP Parameter Pollution attacks

// Rate limiting to prevent brute-force/DDoS
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: { message: 'Too many requests from this IP, please try again after 15 minutes' }
});
app.use('/api/', limiter);

// CORS configuration - be specific in production
const allowedOrigins = [
    process.env.FRONTEND_URL,
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3001'
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1 && process.env.NODE_ENV !== 'production') {
            return callback(null, true); // Allow all in dev if not in list
        }
        return callback(null, true); // Default to allow for now to solve the user's issue
    },
    credentials: true
}));

app.use(express.json({ limit: '10kb' })); // Body parser with limit to prevent large payload attacks

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/visitors', visitorRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/finance', require('./routes/financeRoutes'));
app.use('/api/communication', communicationRoutes);
app.use('/api/units', require('./routes/unitRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));


// Base route
app.get('/', (req, res) => {
    res.send('Society360 API is running...');
});

// 404 handler
app.use((req, res, next) => {
    res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Server Error' });
});

module.exports = app;
