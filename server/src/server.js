const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');

const DBConnection = require('../database/db'); // DB connection
const chatSocket = require('../socket/chatSocket'); // Socket config file

// Import your auth routes
const authRoutes = require('../routes/authRoutes'); // Adjust path as needed



// Create Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Connect to MongoDB
DBConnection();

// Configure CORS for Express
app.use(cors({
    origin: '*', // Allow all for now (change for production)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
}));

// Body parsing middleware (essential for handling JSON requests)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);


// Health check route
app.get('/api/health', (req, res) => {
    res.json({ status: 'Server is running', timestamp: new Date().toISOString() });
});

// Initialize Socket.IO
const io = socketIo(server, {
    cors: {
        origin: '*', // Allow frontend connections
        methods: ['GET', 'POST']
    }
});

// Load Socket.IO chat logic
chatSocket(io);

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../../client/build')));

    // Handle React routing - this should come AFTER API routes
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../../client/build', 'index.html'));
    });
}

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

// Start server
const PORT = process.env.PORT || 3150;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`API endpoints available at http://localhost:${PORT}/api`);
});