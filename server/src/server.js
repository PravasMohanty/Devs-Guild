const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');

const DBConnection = require('../database/db'); // DB connection
const chatSocket = require('../socket/chatSocket'); // Socket config file

// Create Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Connect to MongoDB
DBConnection();

// Configure CORS for Express
app.use(cors({
    origin: '*', // Allow all for now (change for production)
    methods: ['GET', 'POST']
}));

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
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../../client/build', 'index.html'));
    });
}

// Start server
const PORT = process.env.PORT || 3150;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
