import { useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Helmet } from "react-helmet-async";
// MUI
import { TextField, Button, CircularProgress, Box, Typography } from "@mui/material";

// Validation schema
const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const DEMO_ACCOUNT = {
      email: "dummy@gmail.com",
      password: "demopassword",
  };
  const allowRegistration = import.meta.env.VITE_ALLOW_REGISTRATION === "true";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    const result = await login(data.email, data.password);

    if (result.error) {
      setError("root", { message: result.error });
    } else {
      navigate("/home");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Helmet>
        <title>TodoAllDay | Login</title>
      </Helmet>

      <Box 
        className="bg-white p-8 rounded-2xl shadow-md w-80"
        sx={{
          backgroundColor: "background.lev2",
          color: "text.primary",
        }}
      >
        <h2 className="text-2xl font-semibold text-center mb-6">TodoAllDay</h2>

        {errors.root && (
          <p className="text-red-500 text-sm mb-4 text-center">{errors.root.message}</p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            error={!!errors.email}
            helperText={errors.email?.message}
            {...register("email")}
            sx={{ borderRadius: "8px" }}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            error={!!errors.password}
            helperText={errors.password?.message}
            {...register("password")}
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
            }}
          >
            {isSubmitting ? <CircularProgress size={24} color="inherit" /> : "Login"}
          </Button>
        </form>

        {allowRegistration ? (
          <p className="text-sm text-center mt-4">
            Don’t have an account?{" " }
            <Link to="/register" className=" hover:underline">
              Register here
            </Link>
          </p>
        ) : (
          <p className="text-sm text-center mt-4">
            Registration is currently disabled.
          </p>
        )}

        <Typography 
          onClick={() => onSubmit(DEMO_ACCOUNT)}
          sx={{
            cursor: "pointer",
            color: "text.primary",
            textAlign: "center",
            mt: 2,
            "&:hover": {
              textDecoration: "underline",
            },
          }}
        >
          Try the demo account here!!
        </Typography>
        
      </Box>
    </div>
  );
};

export default Login;