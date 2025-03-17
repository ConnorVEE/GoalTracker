import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost:8000/api",
    withCredentials: true,  
    headers: {
        "Content-Type": "application/json",
    },
});

let csrfToken = null; // Store token in memory

// Request Interceptor: Attach latest CSRF token to every request
axiosInstance.interceptors.request.use(
    async (config) => {
        if (config.url === "/csrf/") {
            return config; // Prevent loop
        }

        try {
            // If no token is set, fetch it
            if (!csrfToken) {
                const response = await axiosInstance.get("/csrf/");
                csrfToken = response.data.csrfToken;
            }

            config.headers["X-CSRFToken"] = csrfToken;
        } catch (error) {
            console.error("Failed to fetch CSRF token:", error);
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor: Refresh CSRF token if 403 error occurs
axiosInstance.interceptors.response.use(
    (response) => response, // Pass successful responses through
    async (error) => {
        if (error.response && error.response.status === 403) {
            console.warn("CSRF token may be expired. Refreshing token...");

            try {
                // Fetch new CSRF token
                const response = await axiosInstance.get("/csrf/");
                csrfToken = response.data.csrfToken;

                // Retry the original request with the new token
                error.config.headers["X-CSRFToken"] = csrfToken;
                return axiosInstance.request(error.config);
            } catch (csrfError) {
                console.error("Failed to refresh CSRF token:", csrfError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
