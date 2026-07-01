import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token"); // or check cookie/sessionStorage
  if (!token) {
    return <Navigate to="/" replace />; // redirect to login
  }
   try {
    const decoded = jwtDecode(token);
    const isExpired = decoded.exp * 1000 < Date.now();

    if (isExpired) {
      localStorage.removeItem("token"); // clean up
      return <Navigate to="/" replace />;
    }
  } catch (e) {
    localStorage.removeItem("token");
    return <Navigate to="/" replace />;
  }
  return children;
};

export default ProtectedRoute;