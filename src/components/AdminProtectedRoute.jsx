import { Navigate } from "react-router-dom";

const AdminProtectedRoute = ({ children }) => {
  const isAdmin = localStorage.getItem("admin") === "true";
  if (!isAdmin) {
    return <Navigate to="/login" />;
  }
  return children;
};

export default AdminProtectedRoute;
