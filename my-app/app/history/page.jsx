"use client";

import { useEffect, useState } from "react";

const History = () => {
    const [patients, setPatients] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const response = await fetch("http://localhost:3001/api/patients");
                const data = await response.json();
                if (data.success) {
                    setPatients(data.patients);
                }
            } catch (error) {
                console.error("Error fetching patients:", error);
            }
        };

        fetchPatients();
    }, []);

    // Filter patients based on search query
    const filteredPatients = patients.filter(patient =>
        patient.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Function to copy patient data
    const copyDataToClipboard = () => {
        if (filteredPatients.length === 0) {
            alert("No patient data to copy!");
            return;
        }

        const dataString = filteredPatients.map(patient =>
            `Patient: ${patient.name}, Age: ${patient.age}, Gender: ${patient.gender}, Condition: ${patient.medicalCondition}, Doctor: ${patient.doctorName}, Hospital: ${patient.hospitalName}`
        ).join("\n");

        navigator.clipboard.writeText(dataString)
            .then(() => alert("Patient data copied!"))
            .catch(err => console.error("Failed to copy:", err));
    };

    return (
        <div className="min-h-screen bg-black text-white p-6">
            <h2 className="text-3xl font-bold mb-4">Patient History</h2>

            {/* Search Bar */}
            <input
                type="text"
                placeholder="Search by name..."
                className="w-full p-2 mb-4 rounded-md bg-gray-800 text-white border border-gray-600 focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />

            {/* Patient Table */}
            <div className="overflow-x-auto relative">
                <table className="min-w-full border border-gray-600">
                    <thead>
                        <tr className="bg-gray-900">
                            <th className="border border-gray-600 p-2">Name</th>
                            <th className="border border-gray-600 p-2">Age</th>
                            <th className="border border-gray-600 p-2">Gender</th>
                            <th className="border border-gray-600 p-2">Blood Type</th>
                            <th className="border border-gray-600 p-2">Medical Condition</th>
                            <th className="border border-gray-600 p-2">Date of Admission</th>
                            <th className="border border-gray-600 p-2">Doctor</th>
                            <th className="border border-gray-600 p-2">Hospital</th>
                            <th className="border border-gray-600 p-2">Insurance</th>
                            <th className="border border-gray-600 p-2">Billing Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPatients.map((patient) => (
                            <tr key={patient._id} className="border border-gray-600">
                                <td className="border border-gray-600 p-2">{patient.name}</td>
                                <td className="border border-gray-600 p-2">{patient.age}</td>
                                <td className="border border-gray-600 p-2">{patient.gender}</td>
                                <td className="border border-gray-600 p-2">{patient.bloodType}</td>
                                <td className="border border-gray-600 p-2">{patient.medicalCondition}</td>
                                <td className="border border-gray-600 p-2">{new Date(patient.dateOfAdmission).toLocaleDateString()}</td>
                                <td className="border border-gray-600 p-2">{patient.doctorName}</td>
                                <td className="border border-gray-600 p-2">{patient.hospitalName}</td>
                                <td className="border border-gray-600 p-2">{patient.insuranceProvider}</td>
                                <td className="border border-gray-600 p-2">{patient.billingAmount}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Copy Button */}
            <div className="flex justify-end mt-4">
                <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                    onClick={copyDataToClipboard}
                >
                    Copy Data
                </button>
            </div>
        </div>
    );
};

export default History;
