"use client"

import React from "react";
import { motion } from "framer-motion";

function Home() {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between px-6 md:px-20 py-12 bg-gray-50 min-h-screen">
      
      {/* Left Section - Text with Framer Motion */}
      <motion.div
        className="md:w-2/5 text-center md:text-left"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-lg md:text-4xl font-bold text-gray-900 leading-snug">
          Enhancing Clinical Decision Support Systems with{" "}
          <span className="text-blue-700">Retrieval-Augmented Generation (RAG)</span> Model
        </h1>
        <p className="mt-4 text-sm md:text-lg text-gray-700 leading-relaxed">
          By integrating RAG into Clinical Decision Support Systems (CDSS), we improve accuracy, efficiency, and 
          context-aware recommendations for medical professionals. This ensures real-time, data-driven decisions 
          that enhance patient outcomes.
        </p>
      </motion.div>

      {/* Right Section - Image with Motion (Up & Down Animation) */}
      <motion.div
        className="md:w-3/5 flex justify-center mt-6 md:mt-0"
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
      >
        <img 
          src="./HomeBackGround.png" 
          alt="Clinical Decision Support" 
          className="w-full max-w-7xl mix-blend-multiply object-cover"
        />
      </motion.div>
    </div>
  );
}

export default Home;