// src/components/ChatInput.jsx
import React, { useState } from "react";

const ChatInput = ({ onSendMessage }) => {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim()) {
      onSendMessage(input);
      setInput("");
    }
  };

  return (
    <div className="flex items-center gap-2 p-2 bg-white border-t">
      <input
        type="text"
        className="flex-grow border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
        placeholder="Type a message..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button
        onClick={handleSend}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        Send
      </button>
    </div>
  );
};

export default ChatInput;
