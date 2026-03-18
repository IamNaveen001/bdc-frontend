import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import LoadingSpinner from './LoadingSpinner.jsx';

export default function AdminRoute({ children }) {
  const { user, role, loading } = useAuth();

  if (loading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/admin-login" replace />;
  if (role !== 'admin') return <Navigate to="/dashboard" replace />;

  return children;
}
