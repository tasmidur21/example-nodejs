// src/components/Chat.js
import React, { useEffect, useState } from 'react';
import { ref, onValue, push } from 'firebase/database';
import MessageInput from './MessageInput';
import Message from './Message';
import { db } from '../firebaseConfig';


const Chat = () => {
  const [messages, setMessages] = useState([]);
  const chatRoomId = 'userA_userB'; // Example chat room ID
  const userId = 'userA'; // Example user ID
  useEffect(() => {
    const messagesRef = ref(db, `chatrooms/${chatRoomId}/messages`);
    console.log("messagesRef", messagesRef);
    
    onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      console.log(data);
      const messagesList = data ? Object.keys(data).map(id => ({ id, ...data[id] })) : [];
      setMessages(messagesList);
    });
    
  }, [chatRoomId]);

  const sendMessage = async (content) => {
    const messagesRef = ref(db, `chatrooms/${chatRoomId}/messages`);
    await push(messagesRef, {
      sender: userId,
      content,
      timestamp: Date.now(),
      seen: { [userId]: true },
    });
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg) => (
          <Message key={msg.id} message={msg} currentUser ={userId} />
        ))}
      </div>
      <MessageInput sendMessage={sendMessage} />
    </div>
  );
};

export default Chat;