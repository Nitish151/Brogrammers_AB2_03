"use client";

import React, { useState } from "react";

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { text: "How can I help you today?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" };
    setMessages([...messages, userMessage]);
    setInput("");
  };

  return (
    <div className="flex flex-col h-screen w-full bg-gray-100 overflow-hidden">
      
      {/* Chat Messages */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`p-3 rounded-2xl max-w-[70%] text-sm ${
                msg.sender === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 text-gray-900"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input Box (Fixed at Bottom) */}
      <div className="p-4 bg-gray-100 flex items-center gap-3 w-full">
        <input
          type="text"
          className="flex-1 p-3 rounded-full outline-none text-sm bg-white"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          className="bg-teal-600 text-white px-5 py-3 rounded-full"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;