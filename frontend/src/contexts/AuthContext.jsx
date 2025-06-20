import { createContext, useState, useEffect } from "react";
import { registerUser, loginUser, logoutUser } from "../api/auth";

// test 
import axios from "../api/axiosInstance";
// test


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);   
    const [loading, setLoading] = useState(true); 

    // Check if user is authenticated on initial load
    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const response = await axios.get("/user/");
                if (response.data?.user) {
                    setUser(response.data.user);
                    setIsAuthenticated(true);
                }
            } catch (err) {
                setUser(null);
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        fetchCurrentUser();
    }, []);

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
            await registerUser(first_name, last_name, email, password);
    
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
        <AuthContext.Provider value={{ user, setUser, isAuthenticated, loading, login, logout, register }}>
        {/* // <AuthContext.Provider value={{ user, setUser, isAuthenticated, login, logout, register }}> */}
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext };