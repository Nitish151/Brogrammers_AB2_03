"use client";

import React, { useState } from "react";

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { text: "Enter how you are feeling? Describe symptoms in detail for accurate help.", sender: "bot" },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" };
    setMessages([...messages, userMessage]);

    setInput(""); // ✅ Clears the input field after sending

    try {
      const response = await fetch("http://localhost:5000/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patient_ehr: "Sample EHR Data",
          clinical_question: input,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        const formattedResponse = formatResponse(data.recommendation); // ✅ Formats the response for better readability
        setMessages((prev) => [...prev, { text: formattedResponse, sender: "bot" }]);
      } else {
        console.error("API Error:", data.error);
      }
    } catch (error) {
      console.error("Request Failed:", error);
    }
  };

  const formatResponse = (text) => {
    return text.replace(/\n/g, "\n\n• "); // ✅ Adds bullet points and spacing for readability
  };

  return (
    <div className="flex flex-col h-[92vh] w-full bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white overflow-hidden">
      {/* Chat Messages */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`p-3 rounded-2xl max-w-[70%] text-sm whitespace-pre-line ${msg.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-700 text-gray-200"}`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-4 bg-gray-800 flex items-center gap-3 w-full">
        <input
          type="text"
          className="flex-1 p-3 rounded-full outline-none text-sm bg-gray-700 text-white placeholder-gray-400"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
        />
        <button className="bg-teal-500 text-white px-5 py-3 rounded-full hover:bg-teal-600" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;