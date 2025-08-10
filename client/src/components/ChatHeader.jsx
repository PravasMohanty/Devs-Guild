import React from 'react';

const ChatHeader = ({ username, onlineCount, isConnected }) => (
    <header className="bg-gradient-to-br from-yellow-900 via-orange-800 to-amber-700 text-amber-100 px-7 py-5 flex justify-between items-center md:px-7 md:py-5 sm:px-5 sm:py-4">
        <h1 className="text-2xl font-semibold md:text-2xl sm:text-xl">
            🛡️ ⚔️ Dev's Guild ⚔️ 🛡️
        </h1>
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-sm font-medium">
                <span>👤</span>
                <span>{username}</span>
            </div>
            <div className="bg-amber-800/30 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm flex items-center gap-2 border border-amber-600/30">
                <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'} shadow-sm`}></span>
                <span className="font-medium">{onlineCount} online</span>
            </div>
        </div>
    </header>
);

export default ChatHeader;