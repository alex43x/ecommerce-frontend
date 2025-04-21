// src/components/ProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/auth/AuthContext";

const ProtectedRoute = ({ allowedRoles }) => {
  const { autenticated, loading, user } = useAuth();

  if (loading) return <div>Cargando...</div>;

  if (!autenticated) return <Navigate to="/login" />;

  if (!allowedRoles.includes(user?.role)) return <Navigate to="/unauthorized" />;

  return <Outlet />;
};

export default ProtectedRoute;
