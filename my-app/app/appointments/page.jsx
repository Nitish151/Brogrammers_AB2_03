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
    setShowCalendar(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ name, selectedDate, time, location, doctor });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white p-8">
      <h2 className="text-3xl font-bold mb-6">Book an Appointment</h2>
      <form onSubmit={handleSubmit} className="w-full max-w-2xl bg-gray-800 p-6 rounded-lg shadow-lg space-y-4">
        <input
          type="text"
          placeholder="Enter your name"
          className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <div>
          <input
            type="text"
            placeholder="Select a date"
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white cursor-pointer"
            value={selectedDate ? selectedDate.toDateString() : ""}
            onClick={() => setShowCalendar(true)}
            readOnly
          />
          {showCalendar && (
            <div className="absolute mt-2 bg-gray-800 shadow-lg p-2 rounded">
              <Calendar onChange={handleDateChange} value={selectedDate} className="text-white" />
            </div>
          )}
        </div>
        <input
          type="time"
          className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Enter location"
          className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />
        <select
          className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white"
          value={doctor}
          onChange={(e) => setDoctor(e.target.value)}
          required
        >
          <option value="">Select a doctor</option>
          <option value="Dr. Smith">Dr. Smith</option>
          <option value="Dr. Johnson">Dr. Johnson</option>
          <option value="Dr. Williams">Dr. Williams</option>
        </select>
        <button
          type="submit"
          className="w-full bg-teal-500 text-white p-3 rounded hover:bg-teal-600"
        >
          Book Appointment
        </button>
      </form>
    </div>
  );
}

export default Appointments;