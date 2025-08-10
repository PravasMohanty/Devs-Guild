const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,       // prevent duplicate usernames
        trim: true,
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
