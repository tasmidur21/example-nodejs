// src/components/ChatBox.jsx
import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { ref, onValue, push, serverTimestamp } from "firebase/database";
import Message from "./Message";
import ChatInput from "./ChatInput";

export  const userId = `user-${Math.floor(Math.random() * 1000)}`; // Replace with the actual user ID

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const roomId = "chat-rooms/1004/messages"; // Replace with the actual chat room ID
  const [messageText, setMessageText] = useState('');
    const [replyTo, setReplyTo] = useState(null); // State to track the message being replied to


  useEffect(() => {
    const messagesRef = ref(db, roomId);
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      const messageList = data
        ? Object.keys(data).map((key) => ({ id: key, ...data[key] }))
        : [];
      setMessages(messageList);
    });
    return () => unsubscribe();
  }, [roomId]);

  
  // Send a new message to the specific chat room
  const handleSendMessage = async (newMessage) => { 
    const content=newMessage;
    try {
        const sendMessage=await fetch('http://192.168.1.18:3010/send-message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                roomId, 
                content: content, 
                replyTo: replyTo ? replyTo.id : null,
                userId
            }),
        })
        const response = await sendMessage.json();
        console.log(response);
    }catch (error) {
        console.log(error);
    }
  };

  const handleReply = (message) => {
    console.log("Message being replied to:", message);
    
    setReplyTo(message); // Set the message to reply to
    setMessageText(`@${message.sender.name}: `); // Pre-fill the input with the message being replied to
};

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-grow overflow-y-auto p-4 bg-gray-50">
        {messages.map((message) => (
         <Message 
         key={message.id} 
         message={message} 
         userId={userId} 
         replyTo={messages.find(m => m.id === message.replyTo)} // Find the message being replied to
         handleReply={handleReply} // Pass the handleReply function
     />
        ))}
      </div>

      {/* Chat Input */}
      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default ChatBox;
