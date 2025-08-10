// ChatPage.jsx
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../App'; // Import useAuth from App.jsx
import ChatContainer from './ChatContainer';
import socket from '../socket';

const ChatPage = () => {
    const { user, logout } = useAuth();
    const [messages, setMessages] = useState([]);
    const [activeUsers, setActiveUsers] = useState([]);
    const [isConnected, setIsConnected] = useState(false);

    // Update your ChatPage useEffect in App.jsx with more detailed logging
    useEffect(() => {
        console.log('ChatPage mounted with user:', user);

        if (user && user.username) {
            console.log('🔌 Attempting to connect socket for user:', user.username);

            // Ensure socket is disconnected first
            if (socket.connected) {
                console.log('🔄 Socket already connected, disconnecting first...');
                socket.disconnect();
            }

            // Socket connect handler
            // Add this test in your handleConnect function
            const handleConnect = () => {
                console.log("✅ Connected to backend, socket ID:", socket.id);
                setIsConnected(true);

                // Test 1: Simple echo test
                socket.emit('test_echo', 'Hello from frontend');
                socket.once('test_echo_response', (data) => {
                    console.log('🔄 Echo test response:', data);
                });

                // Test 2: Request current active users
                socket.emit('get_active_users');
                socket.once('current_active_users', (users) => {
                    console.log('📊 Current active users from server:', users);
                });

                // Original user_joined logic with delay
                setTimeout(() => {
                    console.log('👋 Emitting user_joined with username:', user.username);
                    socket.emit("user_joined", user.username);
                }, 200); // Increased delay
            };

            // Message history handler
            const handleMessageHistory = (history) => {
                console.log(`📋 Received message history: ${history.length} messages`);
                console.log('Message history:', history);
                setMessages(history);
            };

            // Active users handler
            const handleActiveUsers = (users) => {
                console.log('👥 Received active users:', users);
                console.log('Active users array length:', users.length);
                console.log('My username:', user.username);
                console.log('Am I in the list?', users.includes(user.username));
                setActiveUsers(users);
            };

            // New message handler
            const handleNewMessage = (msg) => {
                console.log('💬 Received new message:', msg);
                console.log('Message type:', msg.type);
                console.log('Message username:', msg.username);
                console.log('Message content:', msg.message);
                setMessages(prev => [...prev, msg]);
            };

            // Connection error handler
            const handleConnectError = (error) => {
                console.error('❌ Socket connection error:', error);
                setIsConnected(false);
            };

            // Disconnect handler
            const handleDisconnect = (reason) => {
                console.log('❌ Socket disconnected:', reason);
                setIsConnected(false);
            };

            // Add event listeners BEFORE connecting
            socket.on("connect", handleConnect);
            socket.on("message_history", handleMessageHistory);
            socket.on("active_users", handleActiveUsers);
            socket.on("new_message", handleNewMessage);
            socket.on("connect_error", handleConnectError);
            socket.on("disconnect", handleDisconnect);

            // Connect socket AFTER setting up listeners
            console.log('🚀 Connecting socket...');
            socket.connect();

            // Cleanup function
            return () => {
                console.log('🧹 Cleaning up socket listeners');
                socket.off("connect", handleConnect);
                socket.off("message_history", handleMessageHistory);
                socket.off("active_users", handleActiveUsers);
                socket.off("new_message", handleNewMessage);
                socket.off("connect_error", handleConnectError);
                socket.off("disconnect", handleDisconnect);
                socket.disconnect();
            };
        } else {
            console.log('❌ No user or username found, not connecting socket');
        }
    }, [user]);

    const onSendMessage = (text) => {
        if (user && user.username && text.trim()) {
            console.log('📤 Sending message:', { username: user.username, message: text });
            socket.emit("send_message", { username: user.username, message: text });
        } else {
            console.error('❌ Cannot send message - missing user, username, or empty message');
        }
    };

    const handleLogout = () => {
        console.log('👋 User logging out, disconnecting socket');
        socket.disconnect();
        logout();
    };

    if (!user) {
        return <Navigate to="/auth" replace />;
    }

    return (
        <div className="relative">
            {/* Connection status indicator */}
            <div className="absolute top-4 left-4 z-50 flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm text-white">
                    {isConnected ? 'Connected' : 'Disconnected'}
                </span>
                <span className="text-xs text-gray-400">
                    Active users: {activeUsers.length}
                </span>
            </div>

            {/* Logout button */}
            <button
                onClick={handleLogout}
                className="absolute top-4 right-4 z-50 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
                Logout
            </button>

            <ChatContainer
                username={user.username}
                messages={messages}
                activeUsers={activeUsers}
                typingUsers={[]}
                isConnected={isConnected}
                onSendMessage={onSendMessage}
                onTypingStart={() => { }}
                onTypingStop={() => { }}
            />
        </div>
    );
};

export default ChatPage;