"use client";

import React, { useState } from "react";

function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    console.log(name);
    console.log(email);
    console.log(password);
    

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Something went wrong");

      setSuccess("User registered successfully!");
      console.log("Success:", data);
    } catch (error) {
      setError(error.message);
      console.error("Error:", error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 text-white">
      <div className="bg-gray-600 p-8 rounded-lg shadow-2xl w-96">
        <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        {success && <p className="text-green-500 text-sm text-center">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Input */}
          <div>
            <label className="block text-sm font-medium">Full Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              className="w-full p-2 mt-1 bg-gray-500 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:bg-gray-400"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

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
              placeholder="Create a password"
              className="w-full p-2 mt-1 bg-gray-500 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:bg-gray-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 p-2 rounded font-semibold transition-all duration-200"
          >
            Sign Up
          </button>
        </form>

        {/* Already have an account? */}
        <p className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <a href="/signin" className="text-blue-300 hover:underline">
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
}

export default SignUp;