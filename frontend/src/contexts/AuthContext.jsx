import { createContext, useState, useEffect } from "react";
import { registerUser, loginUser, logoutUser } from "../api/auth";
import axiosInstance from "../api/axiosInstance";
import { getAccessToken, setAccessToken, clearAccessToken } from "../api/authToken";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);   
    const [loading, setLoading] = useState(true); 

    // Set the onLogout function in axiosInstance
    useEffect(() => {
        setOnLogout(logout);
    }, []);

    // Check if user is authenticated on initial load
    useEffect(() => {
        const initializeAuth = async () => {
            try {
                // Attempt to get a new access token via refresh cookie
                const refreshResponse = await axiosInstance.post("/refresh/"); 
                const accessToken = refreshResponse.data.access;

                if (accessToken) {
                    setAccessToken(accessToken); // store in memory

                    // Now fetch current user
                    const userResponse = await axiosInstance.get("/user/");
                    setUser(userResponse.data);
                    setIsAuthenticated(true);
                }
            } catch (err) {
                console.warn("User not logged in or refresh failed", err);
                setUser(null);
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();
    }, []);

    // Login function
    const login = async (email, password) => {
        try {
            const response = await loginUser(email, password); // your API call
            const { access, user } = response.data;

            setAccessToken(access);   // store access token in memory
            setUser(user);
            setIsAuthenticated(true);

            return { success: true };
        } catch (error) {
            const errorMessage = error.response?.data?.error || "An unexpected error occurred";
            return { error: errorMessage };
        }
    };
    
    // Logout function
    const logout = async () => {
        try {
            await logoutUser();      
            clearAccessToken();       
            setUser(null);
            setIsAuthenticated(false);
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    // Register function 
    const register = async (first_name, email, password) => {
        try {
            await registerUser(first_name, email, password);
            const loginResult = await login(email, password);

            if (loginResult.error) return { error: loginResult.error };
            return { success: true };

        } catch (error) {
            const errorMessage = error.response?.data?.error || "An unexpected error occurred";
            return { error: errorMessage };
        }
    };
    
    return (
        <AuthContext.Provider value={{ user, setUser, isAuthenticated, loading, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext };