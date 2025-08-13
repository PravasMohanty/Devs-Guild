const User = require('../models/User');
const Message = require('../models/Message');

const activeUsers = new Map(); // socket.id -> username

module.exports = (io) => {
    console.log('🚀 Chat Socket initialized');

    io.on('connection', async (socket) => {
        console.log(`🔌 User connected: ${socket.id}`);
        console.log(`📊 Current active users count: ${activeUsers.size}`);

        try {
            // Send last 50 messages to the newly connected user
            const history = await Message.find().sort({ timestamp: -1 }).limit(50);
            console.log(`📋 Sending ${history.length} messages to ${socket.id}`);
            socket.emit('message_history', history.reverse());

            // Send currently active users
            const activeUsersList = Array.from(activeUsers.values());
            console.log(`👥 Active users to send: ${activeUsersList.join(', ')}`);
            socket.emit('active_users', activeUsersList);
        } catch (error) {
            console.error('Error sending initial data:', error);
        }

        // Handle user joining
        // Update your user_joined handler in chatSocket.js
        socket.on('user_joined', async (username) => {
            try {
                console.log(`👋 User joining: ${username} (socket: ${socket.id})`);
                console.log(`📊 Active users before join: ${Array.from(activeUsers.values()).join(', ')}`);

                if (!username || username.trim() === '') {
                    console.error('❌ Invalid username received');
                    return;
                }

                // Check if user is already in activeUsers (prevent duplicates)
                const existingSocketId = Array.from(activeUsers.entries())
                    .find(([socketId, user]) => user === username)?.[0];

                if (existingSocketId && existingSocketId !== socket.id) {
                    console.log(`⚠️  User ${username} already exists with socket ${existingSocketId}, removing old entry`);
                    activeUsers.delete(existingSocketId);
                }

                activeUsers.set(socket.id, username);
                console.log(`✅ Added ${username} to active users. Total active: ${activeUsers.size}`);
                console.log(`📊 Active users after join: ${Array.from(activeUsers.values()).join(', ')}`);

                // Send confirmation to the joining user
                socket.emit('join_confirmed', {
                    username,
                    socketId: socket.id,
                    activeUsersCount: activeUsers.size
                });

                // Update user in database
                await User.updateOne(
                    { username },
                    { $set: { lastSeen: null }, $setOnInsert: { joinedAt: new Date() } },
                    { upsert: true }
                );
                console.log(`💾 Updated user ${username} in database`);

                // Create join message
                const joinMsg = await Message.create({
                    username: 'System',
                    message: `${username} joined the chat`,
                    type: 'system',
                    timestamp: new Date()
                });
                console.log(`📝 Created join message:`, joinMsg);

                console.log(`📢 Broadcasting join message for ${username} to ${io.sockets.sockets.size} connected sockets`);
                io.emit('new_message', joinMsg);

                const updatedActiveUsers = Array.from(activeUsers.values());
                console.log(`📤 Broadcasting active users: ${updatedActiveUsers.join(', ')}`);
                io.emit('active_users', updatedActiveUsers);

                console.log(`🎉 Successfully processed join for ${username}`);

            } catch (error) {
                console.error('❌ Error handling user join:', error);
                console.error('Stack trace:', error.stack);
            }
        });

        // Handle sending message
        socket.on('send_message', async ({ username, message }) => {
            try {
                console.log(`💬 Message from ${username}: ${message}`);

                if (!username || !message) {
                    console.error('❌ Invalid message data received');
                    return;
                }

                const msg = await Message.create({
                    username,
                    message,
                    type: 'user',
                    timestamp: new Date()
                });

                console.log(`📤 Broadcasting message from ${username} to ${io.sockets.sockets.size} sockets`);
                io.emit('new_message', msg);
            } catch (error) {
                console.error('Error handling message:', error);
            }
        });

        // Handle disconnect
        socket.on('disconnect', async () => {
            try {
                const username = activeUsers.get(socket.id);
                console.log(`❌ User disconnecting: ${socket.id} (${username || 'unknown'})`);
                console.log(`📊 Active users before disconnect: ${Array.from(activeUsers.values()).join(', ')}`);

                if (username) {
                    activeUsers.delete(socket.id);
                    console.log(`🗑️  Removed ${username} from active users. Remaining: ${activeUsers.size}`);
                    console.log(`📊 Active users after disconnect: ${Array.from(activeUsers.values()).join(', ')}`);

                    // Update user's last seen
                    await User.updateOne(
                        { username },
                        { $set: { lastSeen: new Date() } }
                    );

                    // Create leave message
                    const leaveMsg = await Message.create({
                        username: 'System',
                        message: `${username} left the chat`,
                        type: 'system',
                        timestamp: new Date()
                    });

                    console.log(`📢 Broadcasting leave message for ${username}`);
                    io.emit('new_message', leaveMsg);

                    const updatedActiveUsers = Array.from(activeUsers.values());
                    console.log(`📤 Broadcasting updated active users: ${updatedActiveUsers.join(', ')}`);
                    io.emit('active_users', updatedActiveUsers);
                }
            } catch (error) {
                console.error('Error handling disconnect:', error);
            }
        });
        // Add these test handlers to your chatSocket.js
        socket.on('test_echo', (data) => {
            console.log('🔄 Received echo test:', data);
            socket.emit('test_echo_response', `Server received: ${data}`);
        });

        socket.on('get_active_users', () => {
            const currentUsers = Array.from(activeUsers.values());
            console.log('📊 Sending current active users:', currentUsers);
            socket.emit('current_active_users', currentUsers);
        });
        // Handle connection errors
        socket.on('error', (error) => {
            console.error(`🚨 Socket error for ${socket.id}:`, error);
        });
    });

    // Handle io errors
    io.on('error', (error) => {
        console.error('🚨 Socket.IO error:', error);
    });
};