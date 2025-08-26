import React, { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "./Navbar";
import { api } from "../api";

function DonorRegister() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    bloodType: "",
    city: "",
    pincode: "",
    contactNumber: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/donors/register", formData);
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response.data.message);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* ✅ Navbar stays at the top */}
      <Navbar />

      {/* ✅ Form centered below navbar */}
      <div className="flex justify-center items-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white p-8 rounded-2xl shadow-md w-full max-w-lg"
        >
          <h2 className="text-3xl font-bold text-red-600 text-center mb-6">
            Donor Registration
          </h2>
          {message && <p className="text-center text-red-500">{message}</p>}
          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="p-3 border rounded-lg w-full"
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="p-3 border rounded-lg w-full"
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="p-3 border rounded-lg w-full"
              required
            />

            <select
              name="bloodType"
              value={formData.bloodType}
              onChange={handleChange}
              className="p-3 border rounded-lg w-full"
              required
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
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleChange}
              className="p-3 border rounded-lg w-full"
              required
            />

            <input
              type="text"
              name="pincode"
              placeholder="Pincode"
              value={formData.pincode}
              onChange={handleChange}
              className="p-3 border rounded-lg w-full"
            />

            <input
              type="text"
              name="contactNumber"
              placeholder="Contact Number"
              value={formData.contactNumber}
              onChange={handleChange}
              className="p-3 border rounded-lg w-full"
              required
            />

            <motion.button
              whileHover={{ scale: 1.05 }}
              type="submit"
              className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold shadow"
            >
              Register
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

export default DonorRegister;
