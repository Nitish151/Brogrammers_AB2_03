"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

const Navbar = () => {
  const [activeLink, setActiveLink] = useState("#home");
  const pathname = usePathname(); // Get current path
  const router = useRouter(); // Navigation router

  useEffect(() => {
    // Ensure Home is highlighted when on the default page
    if (pathname === "/") {
      setActiveLink("#home");
    }
  }, [pathname]);

  const handleSetActive = (link) => {
    setActiveLink(link);

    if (pathname === "/") {
      // If already on home, scroll smoothly
      const section = document.getElementById(link.substring(1)); // Remove #
      if (section) {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      // If on another page, navigate to home first
      router.push(`/${link}`);
    }
  };

  return (
    <nav className="bg-gradient-to-r from-gray-800 via-gray-900 to-black shadow-md fixed top-0 w-full z-50 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image src="/logo.png" alt="Health Hub Logo" width={60} height={60} className="mr-2" />
              <span className="text-xl font-semibold text-teal-400">Health Hub</span>
            </Link>
          </div>
          <div className="flex items-center">
            <div className="hidden md:flex md:space-x-8">
              {["#home", "#about", "#contact", "#profile"].map((link) => (
                <button
                  key={link}
                  onClick={() => handleSetActive(link)}
                  className={`px-3 pt-1 text-sm font-medium ${
                    (activeLink === link && pathname === "/") || (pathname === "/" && link === "#home")
                      ? "text-teal-400 border-b-2 border-teal-400"
                      : "text-gray-300 hover:text-teal-400 hover:border-b-2 hover:border-teal-400"
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