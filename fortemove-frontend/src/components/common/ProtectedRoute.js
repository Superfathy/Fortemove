import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated, getUser } from "../../services/auth";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const authenticated = isAuthenticated();
  const user = getUser();

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
