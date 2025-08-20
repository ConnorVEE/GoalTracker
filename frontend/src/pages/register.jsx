import React, { useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { TextField, Button, CircularProgress } from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// Validation schema
const schema = yup.object().shape({
  first_name: yup.string().required("First name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

function Register() {
  const { register: registerUser } = useContext(AuthContext); // renamed to avoid conflict with RHF's `register`
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const result = await registerUser(data.first_name, data.email, data.password);

      if (result.error) {
        // Inject server error into form
        setError("email", { type: "manual", message: result.error });
        return;
      }

      navigate("/home");
    } catch (err) {
      console.error("Registration failed:", err);
      setError("email", { type: "manual", message: "Something went wrong. Please try again." });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-white p-8 rounded-2xl shadow-md w-80">
        <h2 className="text-2xl font-semibold mb-4 text-center">Register</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <TextField
            fullWidth
            label="First Name"
            variant="outlined"
            {...register("first_name")}
            error={!!errors.first_name}
            helperText={errors.first_name?.message}
            sx={{ borderRadius: "8px" }}
          />

          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
            sx={{ borderRadius: "8px" }}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
            sx={{ borderRadius: "8px" }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isSubmitting}
            sx={{
              color: "white",
              padding: "10px",
              borderRadius: "8px",
              mt: 2,
            }}
          >
            {isSubmitting ? <CircularProgress size={24} color="inherit" /> : "Create Account"}
          </Button>
        </form>

        <p className="text-sm text-center text-[#B39EB5] mt-4">
          Already have an account?{" "}
          <Link to="/" className="text-[#C8A2C8] hover:underline">
            Log-in here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;