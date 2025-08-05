import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";

const ProtectedRoutes = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>;

  return isAuthenticated ? children : <Navigate to="/" />;
};

export default ProtectedRoutes;