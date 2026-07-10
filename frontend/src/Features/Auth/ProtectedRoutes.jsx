import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { Navigate, Outlet } from "react-router-dom";
// MUI
import { Box, CircularProgress } from "@mui/material";

const ProtectedRoutes = () => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) return (
      <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="60vh"
      >
          <CircularProgress />
      </Box>
  );

  return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoutes;