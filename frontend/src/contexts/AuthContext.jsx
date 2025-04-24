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
            await axiosInstance.post("/logout/", {});
    
            setUser(null);
            setIsAuthenticated(false);
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    // Register function 
    const register = async (first_name, last_name, email, password) => {
        
        try {
            await axiosInstance.post("/register/", { first_name, last_name, email, password });
    
            const loginResult = await login(email, password);
            if (loginResult.error) {
                return { error: loginResult.error };
            }
    
            return { success: true }; // make sure something is returned on success
        } catch (error) {
            const errorMessage = error.response?.data?.error || "An unexpected error occurred";
            return { error: errorMessage };
        }
    };
    

    return (
        <AuthContext.Provider value={{ user, setUser, isAuthenticated, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext };