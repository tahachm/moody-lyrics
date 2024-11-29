import React from "react";
import { Navigate } from "react-router-dom";
// import { useAuth } from "./auth";
import { useRecoilValue } from "recoil";
import { isAuthenticatedState } from "./recoil/atoms";

// Define props for ProtectedRoute
interface ProtectedRouteProps {
  element: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {

  const isAuthenticated = useRecoilValue(isAuthenticatedState);
  // Redirect to login page if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Render the protected element
  return element;
};

export default ProtectedRoute;
