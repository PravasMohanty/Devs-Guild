import React, { useState } from 'react';

const MessageInput = ({ onSendMessage, disabled }) => {
    const [message, setMessage] = useState('');

    const submit = e => {
        e.preventDefault();
        if (message.trim()) {
            onSendMessage(message);
            setMessage('');
        }
    };

    return (
        <form onSubmit={submit} className="flex p-5 bg-gray-800 border-t border-gray-700">
            <input
                value={message}
                onChange={e => setMessage(e.target.value)}
                disabled={disabled}
                placeholder="Type your message..."
                className="flex-1 px-3 py-3 rounded-full border-2 border-gray-700 bg-gray-900 text-amber-100 placeholder-amber-400 focus:border-amber-600 focus:outline-none disabled:bg-gray-800 disabled:cursor-not-allowed"
            />
            <button
                type="submit"
                disabled={disabled || !message.trim()}
                className="ml-2.5 px-5 py-3 rounded-full bg-gradient-to-br from-amber-600 via-orange-600 to-red-600 text-white font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:from-amber-500 hover:via-orange-500 hover:to-red-500 hover:shadow-xl hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
                Send
            </button>
        </form>
    );
};

export default MessageInput;