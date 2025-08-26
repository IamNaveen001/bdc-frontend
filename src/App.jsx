import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import DonorRegister from "./components/DonorRegistration";
import FindDonor from "./components/FindDonors";
import Admin from "./components/Admin";
import Broadcast from "./components/Broadcast";
import Login from "./components/Login";
import Profile from "./components/Profile";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import UserProtectedRoute from "./components/UserProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/donorregister" element={<DonorRegister/>} />
        <Route path="/finddonor" element={<FindDonor />} />
        <Route path="/admin" element={<AdminProtectedRoute><Admin /></AdminProtectedRoute>} />
        <Route path="/broadcast" element={<Broadcast />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<UserProtectedRoute><Profile /></UserProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
