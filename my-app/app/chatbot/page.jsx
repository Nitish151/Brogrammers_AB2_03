"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { text: "Enter how are you feeling? Describe syntoms in detail for the accurate help.", sender: "bot" },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" };
    setMessages([...messages, userMessage]);
    setInput("");
  };

  return (
    <div className="flex flex-col h-[92vh] w-full bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white overflow-hidden">

      {/* Chat Messages */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
          >
            <div
              className={`p-3 rounded-2xl max-w-[70%] text-sm ${msg.sender === "user"
                ? "bg-blue-500 text-white"
                : "bg-gray-700 text-gray-200"
                }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input Box (Fixed at Bottom) */}
      <div className="p-4 bg-gray-800 flex items-center gap-3 w-full">
        <input
          type="text"
          className="flex-1 p-3 rounded-full outline-none text-sm bg-gray-700 text-white placeholder-gray-400"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          className="bg-teal-500 text-white px-5 py-3 rounded-full hover:bg-teal-600"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
