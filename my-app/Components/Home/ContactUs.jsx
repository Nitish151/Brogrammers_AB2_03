"use client";
import React from "react";
import { motion } from "framer-motion";

function ContactUs() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center flex-grow p-6 bg-gray-50"
      >
        <div className="max-w-4xl w-full bg-white shadow-lg rounded-lg p-8 text-center">
          <h1 className="text-4xl font-bold mb-6 text-gray-900">Contact Us</h1>
          <p className="text-lg text-gray-700">
            Have any questions or need support? Feel free to reach out to us.  
            We are always happy to assist you!
          </p>
          <p className="text-lg text-gray-700 mt-4">
            📧 Email: support@yourwebsite.com  
            📞 Phone: +123 456 7890  
            📍 Address: 123 Business Street, City, Country
          </p>
        </div>
      </motion.div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white text-center py-6">
        <div className="container mx-auto">
          <p className="text-lg">&copy; {new Date().getFullYear()} YourWebsite. All rights reserved.</p>
          <div className="mt-2">
            <a href="#" className="text-gray-400 hover:text-white mx-2">Privacy Policy</a> |
            <a href="#" className="text-gray-400 hover:text-white mx-2">Terms of Service</a> |
            <a href="#" className="text-gray-400 hover:text-white mx-2">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default ContactUs;