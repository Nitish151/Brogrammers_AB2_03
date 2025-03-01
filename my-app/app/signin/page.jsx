"use client";

import React, { useState } from "react";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 text-white">
      <div className="bg-gray-600 p-8 rounded-lg shadow-2xl w-96">
        <h2 className="text-2xl font-bold text-center mb-6">Sign In</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full p-2 mt-1 bg-gray-500 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:bg-gray-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full p-2 mt-1 bg-gray-500 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:bg-gray-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex justify-between items-center text-sm">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Remember me
            </label>
            <a href="#" className="text-blue-300 hover:underline">
              Forgot password?
            </a>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 p-2 rounded font-semibold transition-all duration-200"
          >
            Sign In
          </button>
        </form>

        {/* Sign Up Link */}
        <p className="mt-4 text-center text-sm">
          Don't have an account?{" "}
          <a href="signup" className="text-blue-300 hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}

export default SignIn;