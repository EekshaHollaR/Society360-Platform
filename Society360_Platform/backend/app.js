const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

// Routes
const authRoutes = require('./routes/authRoutes');
const visitorRoutes = require('./routes/visitorRoutes');
const maintenanceRoutes = require('./routes/maintenanceRoutes');

const app = express();

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(express.json()); // Body parser

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/visitors', visitorRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/finance', require('./routes/financeRoutes'));

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
