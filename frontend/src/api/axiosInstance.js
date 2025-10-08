import axios from "axios";
import { getAccessToken, setAccessToken, clearAccessToken } from "./authToken";
import { toast } from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL;
let onLogout;
// To prevent multiple simultaneous refresh attempts
let isRefreshing = false;
let failedQueue = [];
// To prevent multiple identical toasts
let activeToast = null;

const showToastOnce = (message) => {
  if (activeToast) return;

  activeToast = toast.error(message, {
    id: "global-error",
    duration: 4000,
  });

  // Reset after duration + small buffer
  setTimeout(() => {
    toast.dismiss("global-error");
    activeToast = null;
  }, 4200);
};

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000, 
});

// callback for logout action
export const setOnLogout = (logoutFn) => {
  onLogout = logoutFn;
};

// Process the queue of failed requests
const processQueue = (error, token = null) => {

  failedQueue.forEach(prom => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  
  failedQueue = [];
};

// Request interceptor: attach access token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAccessToken(); // get access token from memory
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 and refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const errorResponse = error.response;

    // Handle timeout errors
    if (error.code === "ECONNABORTED") {
      // showToastOnce("Request timed out. Please try again.");
      toast.error("Request timed out. Please try again.", { id: "global-error" });
      return Promise.reject(error);
    }

    // Handle 401 Unauthorized errors
    if (errorResponse?.status === 401 && !originalRequest._retry) {
      
      // || originalRequest.url.includes("/logout/")
      if ( originalRequest.url.includes("/refresh/") || originalRequest.url.includes("/login/")) {

        // 💡 This is the FINAL failure point for a 401 (e.g., refresh token is bad)
        if (errorResponse.status === 401) {
          processQueue(error, null);
          clearAccessToken();
          if (onLogout) onLogout();
          return Promise.reject(error); 
        }

        return Promise.reject(error);
      }
      
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });

        }).then(token => {
          originalRequest.headers["Authorization"] = `Bearer ${token}`;
          return axiosInstance(originalRequest);

        }).catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshResp = await axios.post(`${API_URL}/refresh/`, {}, { withCredentials: true });
        const newAccess = refreshResp.data.access;

        setAccessToken(newAccess);
        processQueue(null, newAccess);
        originalRequest.headers["Authorization"] = `Bearer ${newAccess}`;

        return axiosInstance(originalRequest);
      } catch (err) {

        // 💡 REFRESH FAILED: This block executes when the refresh token is expired/invalid
        processQueue(err, null);
        clearAccessToken();
        if (onLogout) onLogout();
        
        // Display toast here for the refresh failure
        showToastOnce("⚠️ Session expired. Please log in again");
        
        return Promise.reject(err);

      } finally {
        isRefreshing = false;
      }
      
    }
    
    // Global Error Handling (non-401 errors)

    // A. Network Error Check (No response object)
    if (!errorResponse) {
      
      // Check for the specific Axios/browser network error message
      if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
        showToastOnce("⚠️ You seem to be offline. Check your network connection");

      } else {
        // Other non-response errors (e.g., Axios setup issues)
        showToastOnce("❌ An unknown network error occurred");

      }
      return Promise.reject(error);
    }
    
    // B. Server/Application Error Check (Any other status code that wasn't a 401)
    if (errorResponse.status >= 500) {
      showToastOnce("❌ A server error occurred, please try again later");

    } else if (errorResponse.status === 403) {
      showToastOnce("🚫 Access denied. You don't have permission.");
      
    } 

    // We can uncomment these if we want specific messages for 404 or 400
    // else if (errorResponse.status === 404) {
    //   showToastOnce("❌ Resource not found.");

    // } else if (errorResponse.status === 400) {
    //   // Optional generic fallback
    //    showToastOnce("⚠️ Invalid request. Please check your input.");
    // }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;