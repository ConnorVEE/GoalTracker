import { createContext, useState } from "react";
import axiosInstance from "../api/axiosInstance";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);    

    // Login function
    const login = async (email, password) => {
        try {
            const response = await axiosInstance.post("/login/", { email, password });
    
            const userData = response.data.user;  
            setUser(userData);  
            setIsAuthenticated(true);
    
            return { success: true };  // Indicate successful login
    
        } catch (error) {
            const errorMessage = error.response?.data?.error || "An unexpected error occurred";
            return { error: errorMessage };  
        }
    };
    
    // Logout function
    const logout = async () => {
    
        try {
            await axiosInstance.post("/logout/", {}, {
                withCredentials: true,
            });
    
            setUser(null);
            setIsAuthenticated(false);
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, setUser, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext };