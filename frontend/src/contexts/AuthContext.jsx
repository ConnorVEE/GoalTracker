import { createContext, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { registerUser, loginUser, logoutUser } from "../api/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);    

    // Login function
    const login = async (email, password) => {
        try {
            const response = await loginUser(email, password);
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
            await logoutUser();
    
            setUser(null);
            setIsAuthenticated(false);
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    // Register function 
    const register = async (first_name, last_name, email, password) => {
        
        try {
            await registerUser(firstName, lastName, email, password);
    
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