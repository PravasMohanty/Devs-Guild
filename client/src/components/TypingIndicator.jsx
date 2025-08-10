import React from 'react';

const TypingIndicator = ({ users }) => {
    if (users.length === 0) return null;

    return (
        <div className="flex items-center gap-1.5 text-sm text-amber-300">
            {users.join(', ')} {users.length > 1 ? 'are' : 'is'} typing
            <div className="flex gap-0.5 ml-1">
                <div
                    className="w-1 h-1 bg-amber-400 rounded-full"
                    style={{
                        animation: 'bounce 1.4s infinite ease-in-out',
                        animationDelay: '0s'
                    }}
                ></div>
                <div
                    className="w-1 h-1 bg-amber-400 rounded-full"
                    style={{
                        animation: 'bounce 1.4s infinite ease-in-out',
                        animationDelay: '0.2s'
                    }}
                ></div>
                <div
                    className="w-1 h-1 bg-amber-400 rounded-full"
                    style={{
                        animation: 'bounce 1.4s infinite ease-in-out',
                        animationDelay: '0.4s'
                    }}
                ></div>
            </div>

            <style jsx>{`
                @keyframes bounce {
                    0%, 60%, 100% {
                        transform: translateY(0);
                    }
                    30% {
                        transform: translateY(-5px);
                    }
                }
            `}</style>
        </div>
    );
};

export default TypingIndicator;