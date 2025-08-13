const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,       // prevent duplicate usernames
        trim: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6, // minimum length for security
    },
    email: {
        type: String,
        required: true,
        unique: true,       // prevent duplicate emails
        trim: true,
        lowercase: true,    // normalize email to lowercase
    },
    joinedAt: {
        type: Date,
        default: Date.now,  // first time they joined
    },
    lastSeen: {
        type: Date,         // null if currently online
        default: null,
    }
}, { timestamps: true });
module.exports = mongoose.model('User', userSchema);
