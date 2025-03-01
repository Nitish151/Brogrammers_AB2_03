"use client";
import React from "react";
import { motion } from "framer-motion";

function AboutUs() {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white"
    >
      <div className="max-w-5xl w-full bg-gray-800 shadow-2xl rounded-2xl p-10 text-center">
        <h1 className="text-5xl font-extrabold mb-6">About Us</h1>
        <p className="text-xl text-gray-300 leading-relaxed">
          Welcome to our website! We are committed to providing seamless solutions
          for managing tasks efficiently. Our platform integrates cutting-edge technology
          to enhance productivity and streamline operations. Whether you're an individual
          or a business, we help you stay organized and focused on what matters most.
        </p>
        <p className="text-xl text-gray-300 mt-6">
          Our team is passionate about innovation and delivering high-quality services.
          Join us on this journey to transform the way you work and achieve your goals effortlessly.
        </p>
      </div>
    </motion.div>
  );
}

export default AboutUs;