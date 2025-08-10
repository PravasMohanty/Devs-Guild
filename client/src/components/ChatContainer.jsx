import React from 'react';
import ChatHeader from './ChatHeader';
import Sidebar from './Sidebar';
import MessagesArea from './MessagesArea';
import MessageInput from './MessageInput';

const ChatContainer = ({
    username,
    messages,
    activeUsers,
    typingUsers,
    isConnected,
    onSendMessage,
    onTypingStart,
    onTypingStop
}) => {
    return (
        <div className="min-h-screen bg-gray-950 bg-[url('g2.jpg')] bg-cover bg-center bg-no-repeat flex items-center justify-center p-8">
            <div className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-5xl h-[80vh] flex flex-col overflow-hidden md:rounded-2xl md:h-[80vh] sm:h-screen sm:rounded-none sm:p-0 border border-gray-800">
                <ChatHeader
                    username={username}
                    onlineCount={activeUsers.length}
                    isConnected={isConnected}
                />
                <div className="flex flex-1 overflow-hidden">
                    <Sidebar activeUsers={activeUsers} />
                    <div className="flex-1 flex flex-col overflow-hidden">
                        <MessagesArea
                            messages={messages}
                            typingUsers={typingUsers}
                            currentUsername={username}
                        />
                        <MessageInput
                            onSendMessage={onSendMessage}
                            onTypingStart={onTypingStart}
                            onTypingStop={onTypingStop}
                            disabled={!isConnected}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatContainer;