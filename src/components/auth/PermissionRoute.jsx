import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/auth";

export function PermissionRoute({ permission, children }) {
  const { hasPermission } = useAuth();
  if (permission && !hasPermission(permission)) {
    return <Navigate to="/dashboard/home" replace />;
  }
  return children;
}

PermissionRoute.propTypes = {
  permission: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default PermissionRoute;
