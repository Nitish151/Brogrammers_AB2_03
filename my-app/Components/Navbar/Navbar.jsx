"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const Navbar = () => {
  const [activeLink, setActiveLink] = useState("#home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSetActive = (link) => {
    setActiveLink(link);
    setIsMobileMenuOpen(false);

    // Scroll to the section smoothly
    const section = document.getElementById(link.substring(1)); // Remove #
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav className="bg-white shadow-md fixed top-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image src="/logo.png" alt="Health Hub Logo" width={60} height={60} className="mr-2" />
              <span className="text-xl font-semibold text-teal-600">Health Hub</span>
            </Link>
          </div>
          <div className="flex items-center">
            <div className="hidden md:flex md:space-x-8">
              {["#home", "#about", "#contact", "#profile"].map((link) => (
                <button
                  key={link}
                  onClick={() => handleSetActive(link)}
                  className={`px-3 pt-1 text-sm font-medium ${
                    activeLink === link
                      ? "text-teal-600 border-b-2 border-teal-600"
                      : "text-gray-700 hover:text-teal-600 hover:border-b-2 hover:border-teal-600"
                  }`}
                >
                  {link === "#home"
                    ? "Home"
                    : link === "#about"
                    ? "About Us"
                    : link === "#contact"
                    ? "Contact Us"
                    : "Profile"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;