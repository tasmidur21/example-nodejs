// src/ChatRoom.js
import React, { useEffect, useState } from 'react';
import { db } from '../firebaseConfig';
import { ref, set, onValue } from 'firebase/database';

const ChatRoom = ({ roomId }) => {
    const [messages, setMessages] = useState([]);
    const [messageText, setMessageText] = useState('');

    // Function to send a message
    const sendMessage = () => {
        const messageId = Date.now(); // Unique ID for each message
        set(ref(db, `chatrooms/${roomId}/messages/${messageId}`), {
            text: messageText,
            timestamp: messageId,
        }).then(() => {
            setMessageText(''); // Clear the input field after sending
        }).catch((error) => {
            console.error("Error sending message: ", error);
        });
    };

    // Function to listen for incoming messages
    useEffect(() => {
        const messagesRef = ref(db, `chatrooms/${roomId}/messages/`);
        console.log("Current roomId:", roomId);
        console.log("messagesRef", messagesRef);

        const unsubscribe = onValue(messagesRef, (snapshot) => {
            const data = snapshot.val();
            const messagesArray = [];
            console.log("data", data);

            if (data) {
                for (let id in data) {
                    messagesArray.push({ id, ...data[id] });
                }
            }
            console.log("messagesArray", messagesArray);
            setMessages(messagesArray);
        });

        return () => unsubscribe(); // Cleanup the listener on unmount
    }, [roomId]);

    return (
        <div>
            <h2>Chat Room: {roomId}</h2>
            <div style={{ height: '300px', overflowY: 'scroll', border: '1px solid #ccc', marginBottom: '10px' }}>
                {messages.map(message => (
                    <div key={message.id}>
                        <strong>{new Date(message.timestamp).toLocaleTimeString()}: </strong>
                        <span>{message?.content
                        }</span>
                    </div>
                ))}
            </div>
            <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Type your message..."
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default ChatRoom;