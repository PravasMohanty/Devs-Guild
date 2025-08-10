import axios from "axios";

// Use environment variable with fallback
const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3150";

// Create axios instance with default config
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/auth';
        }
        return Promise.reject(error);
    }
);

// Auth API calls
export const loginUser = async (email, password) => {
    try {
        const response = await api.post('/api/auth/login', { email, password });
        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.error || error.response?.data?.message || 'Login failed'
        };
    }
};

export const registerUser = async (name, username, email, password) => {
    try {
        const response = await api.post('/api/auth/register', {
            name,
            username,
            email,
            password,
            dob: new Date().toISOString().split('T')[0] // Adding default DOB since backend requires it
        });
        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.error || error.response?.data?.message || 'Registration failed'
        };
    }
};

// Chat API calls (your existing functions updated)
export const getMessages = async () => {
    try {
        const res = await api.get('/messages');
        return res.data;
    } catch (error) {
        console.error('Error fetching messages:', error);
        throw error;
    }
};

export const sendMessage = async (message) => {
    try {
        const res = await api.post('/messages', { message });
        return res.data;
    } catch (error) {
        console.error('Error sending message:', error);
        throw error;
    }
};

// User API calls
export const getUserProfile = async () => {
    try {
        const res = await api.get('/api/user/profile');
        return res.data;
    } catch (error) {
        console.error('Error fetching user profile:', error);
        throw error;
    }
};

// Health check
export const checkHealth = async () => {
    try {
        const res = await api.get('/api/health');
        return res.data;
    } catch (error) {
        console.error('Health check failed:', error);
        throw error;
    }
};

export default api;