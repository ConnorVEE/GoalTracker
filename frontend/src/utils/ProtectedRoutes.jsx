import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";

const ProtectedRoutes = ({ children }) => {

  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/" />;

};

export default ProtectedRoutes;