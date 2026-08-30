import { Navigate } from "react-router-dom";
import type { JSX } from "react";

interface Props {
  children: JSX.Element;
}

const ProtectedRoute = ({ children }: Props): JSX.Element => {
  const token = localStorage.getItem("token"); // or however you store auth

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;