import { TextField, Button, CircularProgress } from "@mui/material";
import { Link } from "react-router-dom";

function Register({ handleRegister, loading, username, email, password, setUsername, setEmail, setPassword }) {
  return (
    <div className="flex justify-center items-center min-h-screen bg-[#F9E8D9]">
      <div className="bg-white p-8 rounded-2xl shadow-md w-80">
        <h2 className="text-2xl font-semibold mb-4 text-center text-[#527853]">Register</h2>

        <form>
          <TextField
            fullWidth
            label="Username"
            variant="outlined"
            margin="normal"
            sx={{
              backgroundColor: "#F9E8D9",
              borderRadius: "8px",
            }}
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            variant="outlined"
            margin="normal"
            sx={{
              backgroundColor: "#F9E8D9",
              borderRadius: "8px",
            }}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            margin="normal"
            sx={{
              backgroundColor: "#F9E8D9",
              borderRadius: "8px",
            }}
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

          <p className="text-sm text-center text-[#B39EB5] mt-4">
            Already have an account?{" "}
            <Link to="/" className="text-[#C8A2C8] hover:underline">Sign-in here</Link>
          </p>
        </form>

      </div>
    </div>
  );
}

export default Register;