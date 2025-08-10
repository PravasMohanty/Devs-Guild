const User = require('../models/User');
const Message = require('../models/Message');

const activeUsers = new Map(); // socket.id -> username

module.exports = (io) => {
    io.on('connection', async (socket) => {
        console.log(`🔌 User connected: ${socket.id}`);

        // Send last 50 messages to the newly connected user
        const history = await Message.find().sort({ timestamp: -1 }).limit(50);
        socket.emit('message_history', history.reverse());

        // Send currently active users
        socket.emit('active_users', Array.from(activeUsers.values()));

        // Handle user joining
        socket.on('user_joined', async (username) => {
            activeUsers.set(socket.id, username);

            await User.updateOne(
                { username },
                { $set: { lastSeen: null }, $setOnInsert: { joinedAt: new Date() } },
                { upsert: true }
            );

            const joinMsg = await Message.create({
                username: 'System',
                message: `${username} joined the chat`,
                type: 'system',
            });

            io.emit('new_message', joinMsg);
            io.emit('active_users', Array.from(activeUsers.values()));
        });

        // Handle sending message
        socket.on('send_message', async ({ username, message }) => {
            const msg = await Message.create({
                username,
                message,
                type: 'user'
            });
            io.emit('new_message', msg);
        });

        // Handle disconnect
        socket.on('disconnect', async () => {
            const username = activeUsers.get(socket.id);
            if (username) {
                activeUsers.delete(socket.id);

                await User.updateOne(
                    { username },
                    { $set: { lastSeen: new Date() } }
                );

                const leaveMsg = await Message.create({
                    username: 'System',
                    message: `${username} left the chat`,
                    type: 'system'
                });

                io.emit('new_message', leaveMsg);
                io.emit('active_users', Array.from(activeUsers.values()));
            }
            console.log(`❌ User disconnected: ${socket.id}`);
        });
    });
};
