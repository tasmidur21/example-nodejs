import React from "react";

const Message = ({ message, userId, replyTo, handleReply }) => {
  const isSender = message?.sender?.id === userId;
  console.log("message", message);
  

  return (
    <div className={`flex mb-2 items-start ${isSender ? "justify-end" : "justify-start"}`}>
      {!isSender && (
        <img
          src={message?.sender?.avatar}
          alt={`${message?.sender?.name}'s avatar`}
          className="w-8 h-8 rounded-full mr-2"
        />
      )}
      <div>
        {!isSender && (
          <p className="text-sm text-gray-500 mb-1">{message?.sender?.name}</p>
        )}
        {replyTo && (
          <p className="text-sm text-gray-500 mb-1">
            Replying to: {replyTo.text}
          </p>
        )}
        <div
          className={`max-w-xs px-4 py-2 rounded-lg shadow ${
            isSender ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
          }`}
          dangerouslySetInnerHTML={{__html:  message.text}}
        >
        </div>
        {/* Always show the Reply button */}
        <button
          onClick={() => handleReply(message)}
          className="text-blue-500 text-xs mt-1"
        >
          Reply
        </button>
      </div>
      {isSender && (
        <img
          src={message?.sender?.avatar}
          alt="Your avatar"
          className="w-8 h-8 rounded-full ml-2"
        />
      )}
    </div>
  );
};

export default Message;