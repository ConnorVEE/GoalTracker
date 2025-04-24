import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { TextField, Button, CircularProgress } from "@mui/material";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const { register } = useContext(AuthContext); 
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await register(first_name, last_name, email, password);

    if (result.error) {
      setError(result.error);
    } else {
      navigate("/home");
    }

    setLoading(false);
  }
  
  return (
    <div className="flex justify-center items-center min-h-screen bg-[#F9E8D9]">

      <div className="bg-white p-8 rounded-2xl shadow-md w-80">

        <h2 className="text-2xl font-semibold mb-4 text-center text-[#527853]">Register</h2>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <form onSubmit={handleRegister} className="space-y-4">

          <TextField
            fullWidth
            label="Firstname"
            variant="outlined"
            value={first_name}
            onChange={(e) => setFirstName(e.target.value)}
            sx={{ backgroundColor: "#F9E8D9", borderRadius: "8px" }}
          />

          <TextField
            fullWidth
            label="Lastname"
            variant="outlined"
            value={last_name}
            onChange={(e) => setLastName(e.target.value)}
            sx={{ backgroundColor: "#F9E8D9", borderRadius: "8px" }}
          />

          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ backgroundColor: "#F9E8D9", borderRadius: "8px" }}
          />

          <TextField
            fullWidth
            label="Password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ backgroundColor: "#F9E8D9", borderRadius: "8px" }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              backgroundColor: "#527853",
              "&:hover": { backgroundColor: "#406341" },
              color: "white",
              padding: "10px",
              borderRadius: "8px",
              mt: 2,
            }}
          >
            Create Account
          </Button>
        </form>

        <p className="text-sm text-center text-[#B39EB5] mt-4">
            Already have an account?{" "}
            <Link to="/" className="text-[#C8A2C8] hover:underline">Sign-in here</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;