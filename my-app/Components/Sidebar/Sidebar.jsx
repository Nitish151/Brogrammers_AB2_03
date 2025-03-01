"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, MessageSquare, Home } from "lucide-react";

const Sidebar = () => {
  const pathname = usePathname(); // Get current route

  return (
    <div className="flex flex-col h-screen bg-white border-r border-gray-200 w-64 shadow-md">
      {/* Sidebar Menu */}
      <nav className="flex-grow px-4 py-6">
        <ul className="space-y-2">
          <li>
            <Link
              href="/dashboard"
              className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                pathname === "/dashboard"
                  ? "bg-teal-50 text-teal-600 font-semibold"
                  : "text-gray-700 hover:bg-teal-50 hover:text-teal-600"
              }`}
            >
              <Home className="w-5 h-5 mr-3" />
              <span>Dashboard</span>
            </Link>
          </li>

          <li>
            <Link
              href="/chatbot"
              className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                pathname === "/chatbot"
                  ? "bg-teal-50 text-teal-600 font-semibold"
                  : "text-gray-700 hover:bg-teal-50 hover:text-teal-600"
              }`}
            >
              <MessageSquare className="w-5 h-5 mr-3" />
              <span>Chatbot</span>
            </Link>
          </li>

          <li>
            <Link
              href="/appointments"
              className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                pathname === "/appointments"
                  ? "bg-teal-50 text-teal-600 font-semibold"
                  : "text-gray-700 hover:bg-teal-50 hover:text-teal-600"
              }`}
            >
              <Calendar className="w-5 h-5 mr-3" />
              <span>Book Appointment</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;