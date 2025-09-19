import axios from "axios";
import { getAccessToken, setAccessToken } from "./authToken";

const API_URL = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true, // ensures cookies (refresh token) are sent
  headers: {
    "Content-Type": "application/json",
  },
});

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

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshResponse = await axios.post(
          `${API_URL}/refresh/`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = refreshResponse.data.access;
        setAccessToken(newAccessToken); // store in memory
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        return axiosInstance(originalRequest); // retry original request
      } catch (refreshError) {
        console.error("Refresh token failed", refreshError);
        // optionally log out user or clear memory token
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;