import { Navigate, useLocation } from "react-router-dom";
import { getCurrentUser } from "../utils/auth";
export default function ProtectedRoute({ children, allowedRoles }) {
  const location = useLocation(),
    user = getCurrentUser();
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  if (allowedRoles && !allowedRoles.includes(user.role))
    return <Navigate to="/forbidden" replace state={{ from: location }} />;
  return children;
}
