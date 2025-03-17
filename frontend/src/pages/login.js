import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext"; 

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
    
        // Check if there's an error in the result
        if (result.error) {
            setError(result.error);  // Show the error message from the login function
        } else {
            navigate("/home");  // Redirect on successful login
        }
    
        setLoading(false);
    };
    

    return (
        <form onSubmit={handleLogin}>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
            <button type="submit" disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
            {error && <p>{error}</p>}
        </form>
    );
};

export default Login;