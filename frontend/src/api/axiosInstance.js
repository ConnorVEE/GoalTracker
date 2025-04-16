import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost:8000/api",
    withCredentials: true,  
    headers: {
        "Content-Type": "application/json",
    },
});

let csrfToken = null; // Store CSRF token in memory
let csrfRefreshing = null; // Prevent multiple parallel CSRF fetches

// Function to fetch a fresh CSRF token
const fetchCsrfToken = async () => {

    if (!csrfRefreshing) {

        csrfRefreshing = axiosInstance.get("/csrf/")
            .then((response) => {
                csrfToken = response.data.csrfToken;
                csrfRefreshing = null;
                return csrfToken;
            })
            .catch((error) => {
                console.error("Failed to fetch CSRF token:", error);
                csrfRefreshing = null;
                throw error;
            });
    }
    return csrfRefreshing;
};

// Request Interceptor: Attach latest CSRF token to every request
axiosInstance.interceptors.request.use(
    async (config) => {
        if (config.url === "/csrf/") return config; // Prevent loop

        try {
            if (!csrfToken) {
                csrfToken = await fetchCsrfToken();
            }
            config.headers["X-CSRFToken"] = csrfToken;
        } catch (error) {
            console.error("Failed to fetch CSRF token:", error);
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor: Handle CSRF errors, 401 errors, and backend failures
axiosInstance.interceptors.response.use(
    (response) => response, // Pass successful responses through
    async (error) => {
        const status = error.response?.status;
        const errorMessage = error.response?.data?.message || error.response?.data?.error || "Unknown error";

        // ✅ Handle 403 - Expired CSRF Token (No Retry, Just Refresh)
        if (status === 403) {
            console.warn("CSRF token expired. Fetching a new one...");

            try {
                csrfToken = await fetchCsrfToken();
                error.config.headers["X-CSRFToken"] = csrfToken;
                return axiosInstance.request(error.config);

            } catch (csrfError) {
                console.error("Failed to refresh CSRF token:", csrfError);
            }
        }

        // ✅ Handle 401 - Unauthorized (Differentiate session expiration & login failure)
        if (status === 401) {
            if (errorMessage.includes("Invalid credentials")) {
                console.warn("Login failed: Incorrect username or password.");

            } else if (errorMessage.includes("Session expired")) {
                console.warn("Session expired. Logging out user.");
                // Handle session expiration: clear state, redirect, etc.
            } else {
                console.warn("Unknown 401 error:", errorMessage);
            }
        }

        // ✅ Handle 404 & Server Down Issues
        if (status === 404 || !error.response) {
            console.error("❌ Backend is down or the requested resource was not found.");
            // Optionally, show a user-friendly message or trigger a fallback behavior.
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;