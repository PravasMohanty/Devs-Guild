import { io } from 'socket.io-client';

// Use environment variable with fallback
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3150';

console.log('🔌 Initializing socket with URL:', BACKEND_URL);

const socket = io(BACKEND_URL, {
    autoConnect: false, // We'll connect manually after login
    transports: ['websocket', 'polling'], // Allow both transports
    timeout: 20000,
    forceNew: true
});

// Debug socket events
socket.on('connect', () => {
    console.log('✅ Socket connected:', socket.id);
});

socket.on('disconnect', (reason) => {
    console.log('❌ Socket disconnected:', reason);
});

socket.on('connect_error', (error) => {
    console.error('🚨 Socket connection error:', error);
});

export default socket;