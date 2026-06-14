import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const userRole = (
    user?.role ||
    user?.Role ||
    user?.displayRole ||
    user?.user?.role ||
    user?.user?.Role ||
    ""
  ).toLowerCase();

  const allowed = allowedRoles?.map((role) => role.toLowerCase()) || [];

  if (allowedRoles && !allowed.includes(userRole)) {
    console.log("BLOCKED ROLE:", userRole);
    console.log("USER:", user);
    return <Navigate to="/login" replace />;
  }

  return children;
}