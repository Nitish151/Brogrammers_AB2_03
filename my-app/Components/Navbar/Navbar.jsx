"use client"
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left side - Logo and App Name */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              {/* Replace '/path-to-your-logo.png' with the actual path to your local logo */}
              <Image
                src="/logo.png"
                alt="Health Hub Logo"
                width={60}
                height={60}
                className="mr-2"
              />
              <span className="text-xl font-semibold text-teal-600">Health Hub</span>
            </Link>
          </div>

          {/* Right side - Navigation Links */}
          <div className="flex items-center">
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <Link href="#home" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-700 hover:text-teal-600 hover:border-b-2 hover:border-teal-600">
                Home
              </Link>
              <Link href="#about" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-700 hover:text-teal-600 hover:border-b-2 hover:border-teal-600">
                About Us
              </Link>
              <Link href="#contact" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-700 hover:text-teal-600 hover:border-b-2 hover:border-teal-600">
                Contact Us
              </Link>
              <Link href="#profile" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-700 hover:text-teal-600 hover:border-b-2 hover:border-teal-600">
                Profile
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-500"
                aria-expanded="false"
                onClick={() => {
                  // Add mobile menu toggle functionality here
                  // This would typically set a state variable to show/hide the mobile menu
                  console.log('Toggle mobile menu');
                }}
              >
                <span className="sr-only">Open main menu</span>
                {/* Hamburger icon */}
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div className="hidden md:hidden">
        <div className="pt-2 pb-3 space-y-1">
          <Link href="#home" className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-teal-500 hover:text-teal-700">
            Home
          </Link>
          <Link href="#about" className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-teal-500 hover:text-teal-700">
            About Us
          </Link>
          <Link href="#contact" className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-teal-500 hover:text-teal-700">
            Contact Us
          </Link>
          <Link href="#profile" className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-teal-500 hover:text-teal-700">
            Profile
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;