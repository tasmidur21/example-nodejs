// src/components/FloatingChat.jsx
import React, { useState } from "react";
import ChatBox from "./ChatBox";

const FloatingChat = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-40 left-4 z-50">
      {isOpen ? (
        <div className="w-96 h-96 bg-white shadow-lg rounded-lg flex flex-col">
          <header className="bg-blue-600 text-white flex items-center justify-between px-4 py-2 rounded-t-lg">
            <p className="font-bold">Chat</p>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200"
            >
              ✕
            </button>
          </header>
          <ChatBox />
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center"
        >
          💬
        </button>
      )}
    </div>
  );
};

export default FloatingChat;
