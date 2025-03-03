import { createContext, useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [csrfToken, setCsrfToken] = useState(null);

    useEffect(() => {
        axiosInstance.get("/csrf/")
            .then(response => setCsrfToken(response.data.csrfToken))
            .catch(error => console.error("CSRF token error:", error));

    }, []);
    
    // Login function
    const login = async (email, password) => {

        try {

            const response = await axiosInstance.post("/login/", 
                { email, password },
                { headers: { "X-CSRFToken": csrfToken } }
            );
    
            setUser(response.data.user);
            setIsAuthenticated(true);

            return response.data;

        } catch (error) {
            console.error("Login error:", error);
            return { error: "Invalid credentials" };

        }
    };
    
    // Logout function
    const logout = async () => {
        try {
            await axiosInstance.post("/logout/", {}, { headers: { "X-CSRFToken": csrfToken } });
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
