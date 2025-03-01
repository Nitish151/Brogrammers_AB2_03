"use client";

import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

function Appointments() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [name, setName] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [doctor, setDoctor] = useState("");

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setShowCalendar(false); // Hide calendar after selecting a date
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ name, selectedDate, time, location, doctor });
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg mt-10">
      <h2 className="text-xl font-bold mb-4">Book an Appointment</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Input */}
        <input
          type="text"
          placeholder="Enter your name"
          className="w-full p-2 border border-gray-300 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        {/* Date Input (Triggers Calendar) */}
        <div>
          <input
            type="text"
            placeholder="Select a date"
            className="w-full p-2 border border-gray-300 rounded cursor-pointer"
            value={selectedDate ? selectedDate.toDateString() : ""}
            onClick={() => setShowCalendar(true)}
            readOnly
          />
          {showCalendar && (
            <div className="absolute mt-2 bg-white shadow-lg p-2 rounded">
              <Calendar onChange={handleDateChange} value={selectedDate} />
            </div>
          )}
        </div>

        {/* Time Input */}
        <input
          type="time"
          className="w-full p-2 border border-gray-300 rounded"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
        />

        {/* Location Input */}
        <input
          type="text"
          placeholder="Enter location"
          className="w-full p-2 border border-gray-300 rounded"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />

        {/* Doctor Selection */}
        <select
          className="w-full p-2 border border-gray-300 rounded"
          value={doctor}
          onChange={(e) => setDoctor(e.target.value)}
          required
        >
          <option value="">Select a doctor</option>
          <option value="Dr. Smith">Dr. Smith</option>
          <option value="Dr. Johnson">Dr. Johnson</option>
          <option value="Dr. Williams">Dr. Williams</option>
        </select>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Book Appointment
        </button>
      </form>
    </div>
  );
}

export default Appointments;