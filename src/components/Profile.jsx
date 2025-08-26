import React, { useState, useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from './Navbar';
import { AuthContext } from '../context/AuthContext';
import { api } from '../api';

function Profile() {
  const { user, setUser } = useContext(AuthContext);
  const [formData, setFormData] = useState(user);
  const [message, setMessage] = useState('');

  useEffect(() => {
    setFormData(user);
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put(`/donors/${user._id}`, formData);
      setUser(response.data);
      setMessage('Profile updated successfully');
    } catch (error) {
      setMessage('Error updating profile');
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="flex justify-center items-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white p-8 rounded-2xl shadow-md w-full max-w-lg"
        >
          <h2 className="text-3xl font-bold text-red-600 text-center mb-6">
            Your Profile
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
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              className="p-3 border rounded-lg w-full"
              required
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleChange}
              className="p-3 border rounded-lg w-full"
              required
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              type="submit"
              className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold shadow"
            >
              Update Profile
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

export default Profile;
