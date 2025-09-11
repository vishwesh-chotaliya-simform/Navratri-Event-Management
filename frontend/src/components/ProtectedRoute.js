import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAdmin } = useContext(AuthContext);
  return isAdmin ? children : <Navigate to="/admin/login" replace />;
};

export default ProtectedRoute;