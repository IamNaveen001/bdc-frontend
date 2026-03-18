import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import UserDashboard from './pages/UserDashboard.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import DonorRegistration from './pages/DonorRegistration.jsx';
import DonorSearch from './pages/DonorSearch.jsx';
import Events from './pages/Events.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AdminRoute from './components/AdminRoute.jsx';
import NotFound from './pages/NotFound.jsx';
import Footer from './components/Footer';
import Contact from './pages/Contact.jsx';
import VerifyEmail from './pages/VerifyEmail.jsx';

export default function App() {
  const location = useLocation();
  const isAdminWorkspace = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-slate-50">
      {!isAdminWorkspace && <Navbar />}
      <main className={isAdminWorkspace ? 'min-h-screen' : 'mx-auto w-full max-w-6xl px-4 pb-16 pt-6'}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/donor/register"
            element={
              <ProtectedRoute>
                <DonorRegistration />
              </ProtectedRoute>
            }
          />
          <Route
            path="/donors"
            element={
              <ProtectedRoute>
                <DonorSearch />
              </ProtectedRoute>
            }
          />
          <Route path="/contact" element={<Contact />} />
          <Route path="/events" element={<Events />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        
      </main>
      {!isAdminWorkspace && <Footer/>}
    </div>
  );
}
