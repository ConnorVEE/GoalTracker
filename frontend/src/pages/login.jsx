import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { TextField, Button, CircularProgress } from "@mui/material"; // MUI Components

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    
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
        <div className="flex justify-center items-center min-h-screen bg-[#E6E6FA]">
            {/* Login Box */}
            <div className="bg-[#FAF3F3] p-8 rounded-xl shadow-lg w-96">
                <h2 className="text-2xl font-semibold text-[#B39EB5] text-center mb-6">
                    Welcome Back!
                </h2>
                
                {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

                <form onSubmit={handleLogin} className="space-y-4">
                    {/* Email Input */}
                    <TextField
                        fullWidth
                        label="Email"
                        variant="outlined"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-[#E6E6FA] rounded"
                    />

                    {/* Password Input */}
                    <TextField
                        fullWidth
                        label="Password"
                        type="password"
                        variant="outlined"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-[#E6E6FA] rounded"
                    />

                    {/* Login Button */}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={loading}
                        sx={{
                            backgroundColor: "#D8BFD8",
                            "&:hover": { backgroundColor: "#C8A2C8" },
                            color: "white",
                            padding: "10px",
                            borderRadius: "8px",
                        }}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
                    </Button>
                </form>

                <p className="text-sm text-center text-[#B39EB5] mt-4">
                    Don't have an account?{" "}
                    <a href="#" className="text-[#C8A2C8] hover:underline">Sign Up</a>
                </p>
            </div>
        </div>
    );
};

export default Login;