import React from "react";
import { Navigate } from "react-router-dom";
import { decodeToken } from "./auth"; // Assumes your token decoder is correctly set up

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const token = localStorage.getItem("access_token");

  try {
    const decoded = token && decodeToken(token);

    if (!decoded) throw new Error("Invalid or expired token");

    return <>{children}</>;
  } catch (err) {
    console.warn("Redirecting to login due to token error:", err);
    localStorage.removeItem("access_token");
    return <Navigate to="/login" />;
  }
};

export default AuthGuard;
