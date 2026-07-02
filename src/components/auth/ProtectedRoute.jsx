import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/auth";

export function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/auth/sign-in" replace />;
  return children;
}

ProtectedRoute.propTypes = { children: PropTypes.node.isRequired };

export default ProtectedRoute;
