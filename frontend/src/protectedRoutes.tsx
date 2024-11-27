import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./auth";

// Define props for ProtectedRoute
interface ProtectedRouteProps {
  element: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const { isAuthenticated } = useAuth();

  // Redirect to login page if not authenticated
  // if (!isAuthenticated) {
  //   return <Navigate to="/" replace />;
  // }

  // Render the protected element
  return element;
};

export default ProtectedRoute;
