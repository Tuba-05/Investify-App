import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const userId = localStorage.getItem("userId");
  
  // If user is not logged in, redirect to login page
  if (!userId) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
