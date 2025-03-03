import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext.js";
import { useNavigate } from "react-router-dom";

const Tasks = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const goHome = () => {
    navigate("/home"); // Redirect to login after logout
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Welcome to the tasks page!</h2>
      <button onClick={goHome}>Go home</button>
    </div>
  );
};

export default Tasks;