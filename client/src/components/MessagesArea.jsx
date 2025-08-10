import React, { useEffect, useRef } from 'react';
import Message from './Message';
import TypingIndicator from './TypingIndicator';

const MessagesArea = ({ messages, typingUsers, currentUsername }) => {
    const endRef = useRef(null);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, typingUsers]);

    const filteredTyping = typingUsers.filter(u => u !== currentUsername);

    return (
        <div className="flex-1 p-5 bg-gray-900 overflow-y-auto flex flex-col gap-4">
            {messages.length === 0 ? (
                <div className="text-center text-amber-300 py-8">
                    💬 Welcome to Open Chat!
                </div>
            ) : (
                messages.map(msg => (
                    <div
                        key={msg.id}
                        className="animate-slide-in-up opacity-0 animate-fade-in"
                        style={{
                            animation: 'slideInUp 0.3s ease-out forwards'
                        }}
                    >
                        <Message message={msg} isOwnMessage={msg.username === currentUsername} />
                    </div>
                ))
            )}
            {filteredTyping.length > 0 && (
                <div
                    className="animate-fade-in"
                    style={{
                        animation: 'fadeIn 0.3s ease-out forwards'
                    }}
                >
                    <TypingIndicator users={filteredTyping} />
                </div>
            )}
            <div ref={endRef} />

            <style jsx>{`
                @keyframes slideInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }
            `}</style>
        </div>
    );
};

export default MessagesArea;