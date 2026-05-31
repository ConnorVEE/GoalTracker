import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutes = () => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>;

  return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoutes;