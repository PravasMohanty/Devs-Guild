import React from 'react';

const Message = ({ message, isOwnMessage }) => {
    // Handle system notifications (join/leave messages)
    if (message.type === 'system') {
        return (
            <div className="flex justify-center my-2">
                <div className="text-amber-300 text-sm italic px-4 py-2 bg-gray-800 rounded-full border border-amber-800/30">
                    {message.message}
                </div>
            </div>
        );
    }

    // Handle regular user messages
    return (
        <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'}`}>
            <span className="text-xs font-bold text-amber-200">
                {isOwnMessage ? 'You' : message.username}
            </span>
            <div className={`
                px-3 py-2 rounded-2xl max-w-[70%]
                ${isOwnMessage
                    ? 'bg-gradient-to-r from-yellow-900 to-orange-800 text-amber-100'
                    : 'bg-gray-800 text-amber-100 border border-gray-700'
                }
            `}>
                {message.message}
            </div>
        </div>
    );
};

export default Message;