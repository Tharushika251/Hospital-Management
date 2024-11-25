import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ isAuthenticated, user, requiredRole, children }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" />; // Redirect to login if not authenticated
  }

  if (requiredRole && user?.type !== requiredRole) {
    return <Navigate to="/login" />; // Redirect if user doesn't have the required role
  }

  return children; // Render the protected route content if authenticated and has correct role
};

export default ProtectedRoute;
