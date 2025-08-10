import React, { useState, useEffect } from 'react';
import ChatContainer from './components/ChatContainer';
import UsernameModal from './components/UsernameModal';
import socket from './socket';

const App = () => {
  const [username, setUsername] = useState('');
  const [messages, setMessages] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Socket connect
    socket.on("connect", () => {
      console.log("✅ Connected to backend");
      setIsConnected(true);
    });

    // Receive old messages
    socket.on("message_history", (history) => {
      setMessages(history);
    });

    // Receive active users
    socket.on("active_users", (users) => {
      setActiveUsers(users);
    });

    // Receive new message
    socket.on("new_message", (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    return () => {
      socket.off("connect");
      socket.off("message_history");
      socket.off("active_users");
      socket.off("new_message");
    };
  }, []);

  const onJoin = (name) => {
    setUsername(name);
    socket.emit("user_joined", name);
  };

  const onSendMessage = (text) => {
    socket.emit("send_message", { username, message: text });
  };

  return (
    <>
      {!username ? (
        <UsernameModal onJoin={onJoin} isConnected={isConnected} />
      ) : (
        <ChatContainer
          username={username}
          messages={messages}
          activeUsers={activeUsers}
          typingUsers={[]} // Agar typing feature chahiye to backend me add karna hoga
          isConnected={isConnected}
          onSendMessage={onSendMessage}
          onTypingStart={() => { }}
          onTypingStop={() => { }}
        />
      )}
    </>
  );
};

export default App;
