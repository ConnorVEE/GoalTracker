import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { TextField, Button, CircularProgress } from "@mui/material"; // MUI Components

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [isLoading, setLoading] = useState(false);
    
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const result = await login(email, password);

        if (result.error) {
            setError(result.error);
        } else {
            navigate("/home");
        }

        setLoading(false);
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-[#F9E8D9]">

            <div className="bg-white p-8 rounded-2xl shadow-md w-80">

                <h2 className="text-2xl font-semibold text-center text-[#527853] mb-6">Welcome Back!</h2>

                {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

                <form onSubmit={handleLogin} className="space-y-4">
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
                        type="password"
                        variant="outlined"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        sx={{ backgroundColor: "#F9E8D9", borderRadius: "8px" }}
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={isLoading}
                        sx={{
                        backgroundColor: "#527853",
                        "&:hover": { backgroundColor: "#406341" },
                        color: "white",
                        padding: "10px",
                        borderRadius: "8px",
                        }}
                    >
                        {isLoading ? <CircularProgress size={24} color="inherit" /> : "Login"}
                    </Button>
                </form>

                <p className="text-sm text-center text-[#B39EB5] mt-4">
                    Don’t have an account?{" "}
                    <Link to="/register" className="text-[#C8A2C8] hover:underline">Register here</Link>
                </p>
            </div>
        </div>

    );
};

export default Login;