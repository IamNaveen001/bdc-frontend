import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { api } from "../api";

function Admin() {
  const [donors, setDonors] = useState([]);
  const [formData, setFormData] = useState({
    _id: null,
    name: "",
    email: "",
    bloodType: "",
    phone: "",
    address: "",
    password: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchDonors();
  }, []);

  const fetchDonors = async () => {
    try {
      const response = await api.get("/donors");
      setDonors(response.data);
    } catch (error) {
      console.error("Error fetching donors:", error);
    }
  };

  // ✅ Handle form change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditing) {
      try {
        await api.put(`/donors/${formData._id}`, formData);
        fetchDonors();
        setIsEditing(false);
      } catch (error) {
        console.error("Error updating donor:", error);
      }
    } else {
      try {
        await api.post("/donors", formData);
        fetchDonors();
      } catch (error) {
        console.error("Error adding donor:", error);
      }
    }
    setFormData({ _id: null, name: "", email: "", bloodType: "", phone: "", address: "", password: "" });
  };

  const handleEdit = (donor) => {
    setFormData(donor);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/donors/${id}`);
      fetchDonors();
    } catch (error) {
      console.error("Error deleting donor:", error);
    }
  };

  // ✅ Prepare statistics
  const groupStats = donors.reduce((acc, donor) => {
    acc[donor.bloodType] = (acc[donor.bloodType] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.keys(groupStats).map((group) => ({
    name: group,
    value: groupStats[group],
  }));

  const COLORS = [
    "#EF4444",
    "#F59E0B",
    "#10B981",
    "#3B82F6",
    "#8B5CF6",
    "#EC4899",
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-3xl font-bold text-red-600 mb-6 text-center">
          Admin Dashboard
        </h2>

        {/* Donor Form */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="bg-white p-6 rounded-2xl shadow mb-8"
        >
          <h3 className="text-xl font-bold mb-4 text-red-600">
            {isEditing ? "Edit Donor" : "Add Donor"}
          </h3>
          <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="p-2 border rounded-lg"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="p-2 border rounded-lg"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="p-2 border rounded-lg"
              required
            />
            <select
              name="bloodType"
              value={formData.bloodType}
              onChange={handleChange}
              className="p-2 border rounded-lg"
              required
            >
              <option value="">Blood Group</option>
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
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              className="p-2 border rounded-lg"
              required
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleChange}
              className="p-2 border rounded-lg"
              required
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              type="submit"
              className="bg-red-600 text-white py-2 rounded-lg col-span-3"
            >
              {isEditing ? "Update" : "Add"}
            </motion.button>
          </form>
        </motion.div>

        {/* Donors Table */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="bg-white p-6 rounded-2xl shadow mb-8"
        >
          <h3 className="text-xl font-bold mb-4 text-red-600">Manage Donors</h3>
          <table className="w-full border">
            <thead className="bg-red-100">
              <tr>
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Email</th>
                <th className="border px-4 py-2">Blood Type</th>
                <th className="border px-4 py-2">Address</th>
                <th className="border px-4 py-2">Phone</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {donors.map((donor) => (
                <tr key={donor._id} className="text-center">
                  <td className="border px-4 py-2">{donor.name}</td>
                  <td className="border px-4 py-2">{donor.email}</td>
                  <td className="border px-4 py-2">{donor.bloodType}</td>
                  <td className="border px-4 py-2">{donor.address}</td>
                  <td className="border px-4 py-2">{donor.phone}</td>
                  <td className="border px-4 py-2 space-x-2">
                    <button
                      onClick={() => handleEdit(donor)}
                      className="bg-blue-500 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(donor._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* Statistics */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="bg-white p-6 rounded-2xl shadow"
        >
          <h3 className="text-xl font-bold mb-4 text-red-600">
            Donor Statistics
          </h3>
          <div className="h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Admin;
