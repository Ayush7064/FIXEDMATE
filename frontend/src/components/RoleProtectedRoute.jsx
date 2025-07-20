// Create a new file: src/components/RoleProtectedRoute.jsx

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

const RoleProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  // 1. If the user is not logged in, redirect to the login page.
  if (!isAuthenticated) {
    // Save the location they were trying to go to, so we can redirect them back after login.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. If the user's role is not in the list of allowed roles, redirect them.
  if (!allowedRoles.includes(user?.role)) {
    // You can redirect to an "Unauthorized" page or back to the home page.
    return <Navigate to="/" replace />; 
  }

  // 3. If everything is okay, show the page.
  return children;
};

export default RoleProtectedRoute;
