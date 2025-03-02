"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, MessageSquare, Home , History} from "lucide-react";

const Sidebar = () => {
  const pathname = usePathname(); // Get current route

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black border-r border-gray-700 w-64 shadow-md text-white">
      {/* Sidebar Menu */}
      <nav className="flex-grow px-4 py-6">
        <ul className="space-y-2">
          <li>
            <Link
              href="/chatbot"
              className={`flex items-center px-4 py-3 rounded-lg transition-colors ${pathname === "/chatbot"
                ? "bg-gradient-to-r from-teal-600 to-teal-800 text-white font-semibold"
                : "text-gray-300 hover:bg-gradient-to-r hover:from-teal-600 hover:to-teal-800 hover:text-white"
                }`}
            >
              <MessageSquare className="w-5 h-5 mr-3" />
              <span>Consultation Assistant</span>
            </Link>
          </li>

          <li>
            <Link
              href="/appointments"
              className={`flex items-center px-4 py-3 rounded-lg transition-colors ${pathname === "/appointments"
                ? "bg-gradient-to-r from-teal-600 to-teal-800 text-white font-semibold"
                : "text-gray-300 hover:bg-gradient-to-r hover:from-teal-600 hover:to-teal-800 hover:text-white"
                }`}
            >
              <Calendar className="w-5 h-5 mr-3" />
              <span>Book Appointment</span>
            </Link>
          </li>

          <li>
            <Link
              href="/history"
              className={`flex items-center px-4 py-3 rounded-lg transition-colors ${pathname === "/history"
                ? "bg-gradient-to-r from-teal-600 to-teal-800 text-white font-semibold"
                : "text-gray-300 hover:bg-gradient-to-r hover:from-teal-600 hover:to-teal-800 hover:text-white"
                }`}
            >
              <History className="w-5 h-5 mr-3" />
              <span>History</span>
            </Link>
          </li>
        </ul>
      </nav>

      {/* Sidebar Image */}
      <div className="px-4 pb-20 opacity-70">
        <img
          src="/sidebarimg.png"
          alt="Sidebar Image"
          className="w-full h-auto rounded-lg shadow-lg"
        />
      </div>
    </div>
  );
};

export default Sidebar;