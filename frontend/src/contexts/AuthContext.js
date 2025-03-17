import { createContext, useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    // const [csrfToken, setCsrfToken] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Retrieve CSRF token on app mount
    // useEffect(() => {

    //     const fetchCsrfToken = async () => {
    //         try {

    //             const response = await axiosInstance.get("/csrf/");
    //             setCsrfToken(response.data.csrfToken);
    //             console.log(csrfToken);

    //         } catch (error) {
    //             console.error("Error fetching CSRF token:", error);

    //         }
    //     };

    //     fetchCsrfToken();
    // }, []);

    // useEffect(() => {
    //     console.log("Updated CSRF Token:", csrfToken);
    // }, [csrfToken]);  // This will log every time csrfToken changes    

    // Login function
    const login = async (email, password) => {
        try {
            const response = await axiosInstance.post("/login/", 
                { email, password },
                // {
                //     headers: {
                //         "X-CSRFToken": csrfToken,
                //     },
                // }
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
        // Ensure you're fetching the CSRF token again before logging out
        // const response = await axiosInstance.get("/csrf/");
        // const freshCsrfToken = response.data.csrfToken;

        // console.log("CSRF Token before logout request:", csrfToken);
        // console.log("CSRF Token after logout request:", freshCsrfToken);
    
        try {
            await axiosInstance.post("/logout/", {}, {
                // headers: { "X-CSRFToken": freshCsrfToken },
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