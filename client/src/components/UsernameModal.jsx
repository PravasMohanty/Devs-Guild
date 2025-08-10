import React, { useState } from 'react';

const UsernameModal = ({ onJoin, isConnected }) => {
    const [name, setName] = useState('');

    const submit = e => {
        e.preventDefault();
        if (name.trim()) onJoin(name.trim());
    };

    return (
        <div className="fixed inset-0 bg-gray-950/90 flex items-center justify-center p-4">
            <div className="bg-gray-900 p-10 rounded-2xl text-center max-w-md w-full shadow-2xl border border-gray-800">
                <h2 className="text-2xl font-bold text-amber-200 mb-2">
                    Welcome to Open Chat 💬
                </h2>
                <p className="text-amber-300 mb-6">
                    Enter your username to start chatting
                </p>
                <form onSubmit={submit} className="space-y-4">
                    <input
                        value={name}
                        onChange={e => setName(e.target.value)}
                        disabled={!isConnected}
                        placeholder="Your username..."
                        className="w-full px-3 py-3 rounded-xl border-2 border-gray-700 bg-gray-800 text-amber-100 placeholder-amber-400 focus:border-amber-600 focus:outline-none disabled:bg-gray-700 disabled:cursor-not-allowed transition-colors"
                    />
                    <button
                        type="submit"
                        disabled={!isConnected || !name.trim()}
                        className="w-full py-3 px-4  rounded-full bg-gradient-to-br from-amber-600 via-orange-600 to-red-600 text-white font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:from-amber-500 hover:via-orange-500 hover:to-red-500 hover:shadow-xl hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-gray-900"
                    >
                        {isConnected ? 'Join Chat' : 'Connecting...'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UsernameModal;