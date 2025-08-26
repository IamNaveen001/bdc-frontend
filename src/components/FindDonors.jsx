import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "./Navbar";
import { api } from "../api";
import axios from "axios";

function FindDonor() {
  const [bloodGroup, setBloodGroup] = useState("");
  const [city, setCity] = useState("");
  const [donors, setDonors] = useState([]);
  const [allDonors, setAllDonors] = useState([]);

  useEffect(() => {
    const fetchDonors = async () => {
      try {
        const response = await axios.get("https://bdc-backend-t5td.onrender.com/api/donors");
        setAllDonors(response.data);
        setDonors(response.data);
      } catch (error) {
        console.error("Error fetching donors:", error);
      }
    };
    fetchDonors();
  }, []);

  const handleSearch = () => {
    const results = allDonors.filter(
      (d) =>
        (bloodGroup === "" || d.bloodType === bloodGroup) &&
        (city === "" || d.address.toLowerCase().includes(city.toLowerCase()))
    );
    setDonors(results);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* ✅ Navbar stays at the top */}
      <Navbar />
      <div className="bg-gray-50 min-h-screen p-8">
        <h2 className="text-3xl font-bold text-center text-red-600 mb-8">
          Find Donors
        </h2>

        {/* Search Form */}
        <div className="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow-md mb-8">
          <div className="grid md:grid-cols-3 gap-4">
            <select
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value)}
              className="p-3 border rounded-lg w-full"
            >
              <option value="">Select Blood Group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>

            <input
              type="text"
              placeholder="Enter City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="p-3 border rounded-lg w-full"
            />

            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={handleSearch}
              className="bg-red-600 text-white px-6 py-3 rounded-lg shadow"
            >
              Search
            </motion.button>
          </div>
        </div>

        {/* Results */}
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
          {donors.length === 0 ? (
            <p className="text-center col-span-2 text-gray-600">
              No donors found. Try searching.
            </p>
          ) : (
            donors.map((donor, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="bg-white p-6 rounded-2xl shadow-md"
              >
                <h3 className="text-xl font-bold text-red-600">{donor.name}</h3>
                <p>
                  <strong>Group:</strong> {donor.bloodType}
                </p>
                <p>
                  <strong>City:</strong> {donor.address}
                </p>
                <p>
                  <strong>Contact:</strong> {donor.phone}
                </p>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default FindDonor;
