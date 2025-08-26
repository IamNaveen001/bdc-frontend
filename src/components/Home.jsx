import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom"; // ✅ Import Link
import Navbar from "./Navbar";

function Home() {
  const [selectedGroup, setSelectedGroup] = useState(null);

  const bloodGroups = [
    {
      type: "A+",
      description: "A+ is one of the most common blood groups.",
      canDonate: "A+, AB+",
      canReceive: "A+, A-, O+, O-",
    },
    {
      type: "A-",
      description: "A- is less common but important for A and AB patients.",
      canDonate: "A+, A-, AB+, AB-",
      canReceive: "A-, O-",
    },
    {
      type: "B+",
      description: "B+ is a common type found in many populations.",
      canDonate: "B+, AB+",
      canReceive: "B+, B-, O+, O-",
    },
    {
      type: "B-",
      description: "B- is rarer and important for B and AB patients.",
      canDonate: "B+, B-, AB+, AB-",
      canReceive: "B-, O-",
    },
    {
      type: "AB+",
      description: "AB+ is the universal plasma donor and universal receiver.",
      canDonate: "AB+",
      canReceive: "All groups",
    },
    {
      type: "AB-",
      description: "AB- is rare and can donate to both AB groups.",
      canDonate: "AB+, AB-",
      canReceive: "AB-, A-, B-, O-",
    },
    {
      type: "O+",
      description: "O+ is the most common blood group in the world.",
      canDonate: "O+, A+, B+, AB+",
      canReceive: "O+, O-",
    },
    {
      type: "O-",
      description: "O- is the universal donor for red blood cells.",
      canDonate: "All groups",
      canReceive: "O-",
    },
  ];

  const toggleGroup = (type) => {
    setSelectedGroup(selectedGroup === type ? null : type);
  };

  return (
    <div className="bg-gray-50 min-h-screen text-gray-800">
      {/* Navbar */}
      <Navbar />
      {/* Hero Section */}
      <header className="text-center py-20 bg-gradient-to-r from-red-500 to-red-700 text-white">
        <motion.h2
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-4xl md:text-5xl font-bold mb-6"
        >
          Donate Blood, Save Lives
        </motion.h2>
        <p className="max-w-2xl mx-auto text-lg mb-8">
          Your blood can give someone another chance at life. Join us in making
          a difference today.
        </p>
        {/* ✅ Updated Become a Donor button */}
        <Link
          to="/donorregister"
          className="px-6 py-3 bg-white text-red-600 font-semibold rounded-full shadow hover:bg-gray-100 transition"
        >
          Become a Donor
        </Link>
      </header>

      {/* Features Section */}
      <section className="py-16 px-8 grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* ✅ Updated Find Donors card */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white p-6 rounded-2xl shadow cursor-pointer"
        >
          <Link to="/finddonor">
            <h3 className="text-xl font-bold mb-3 text-red-600">Find Donors</h3>
            <p>Search and connect with nearby blood donors instantly.</p>
          </Link>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white p-6 rounded-2xl shadow cursor-pointer"
        >
          <Link to="/broadcast">
            <h3 className="text-xl font-bold mb-3 text-red-600">
              Easy Broadcast
            </h3>
            <p>Easy Broadcast with blood donors instantly.</p>
          </Link>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white p-6 rounded-2xl shadow"
        >
          <h3 className="text-xl font-bold mb-3 text-red-600">
            Track Donations
          </h3>
          <p>Keep track of your donation history with ease.</p>
        </motion.div>
      </section>

      {/* Info Section */}
      <section className="max-w-4xl mt-10 p-6 bg-white rounded-2xl shadow-md text-center mx-auto">
        <h2 className="text-2xl font-semibold text-red-600">
          Why Donate Blood?
        </h2>
        <p className="mt-4 text-gray-700">
          Every blood donation can save up to 3 lives. By donating blood, you
          help patients suffering from accidents, surgeries, cancer treatments,
          and more. Be a hero today!
        </p>
      </section>

      {/* Know Your Blood Section */}
<section className="max-w-5xl w-full mt-12 px-6 mx-auto">
  <h2 className="text-2xl font-bold text-center text-red-600 mb-6">
    Know Your Blood
  </h2>
  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
    {bloodGroups.map((group) => (
      <div
        key={group.type}
        className="group relative cursor-pointer rounded-2xl shadow-md text-center transition-all duration-300 bg-white hover:bg-red-600 hover:text-white hover:scale-105 h-52 overflow-hidden"
      >
        {/* Always visible */}
        <div className="flex items-center justify-center h-full">
          <h3 className="text-2xl font-bold">{group.type}</h3>
        </div>

        {/* Hover overlay content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 py-6 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-red-600/90 text-white">
          <p className="mb-3 text-base font-medium italic text-center">
            {group.description}
          </p>
          <p className="mb-2">
            <span className="font-semibold">Can Donate To:</span> {group.canDonate}
          </p>
          <p>
            <span className="font-semibold">Can Receive From:</span> {group.canReceive}
          </p>
        </div>
      </div>
    ))}
  </div>
</section>




      {/* Footer */}
      <footer className="w-full mt-12 py-6 bg-red-600 text-white text-center">
        <p>© 2025 Blood Donation Management. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;
