import React, { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Tasks = () => {
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