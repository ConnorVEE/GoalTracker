import axios from "axios";
import { getAccessToken, setAccessToken, clearAccessToken } from "./authToken";

const API_URL = import.meta.env.VITE_API_URL;
let onLogout;

// To prevent multiple simultaneous refresh attempts
let isRefreshing = false;
let failedQueue = [];

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true, // ensures cookies (refresh token) are sent
  headers: {
    "Content-Type": "application/json",
  },
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

    if (error.response?.status === 401 && !originalRequest._retry) {

      if (originalRequest.url.includes("/refresh/")) {
        return Promise.reject(error);
      }

      // if already refreshing, queue the request
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

        processQueue(err, null);
        clearAccessToken();
        if (onLogout) onLogout();
        return Promise.reject(err);

      } finally {
        isRefreshing = false;
      }
    }

    // if (error.response?.status === 401 && !originalRequest._retry) {

    //   originalRequest._retry = true;

    //   try {
    //     const refreshResponse = await axios.post(
    //       `${API_URL}/refresh/`,
    //       {},
    //       { withCredentials: true }
    //     );

    //     const newAccessToken = refreshResponse.data.access;
    //     setAccessToken(newAccessToken); // store in memory
    //     originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

    //     return axiosInstance(originalRequest); // retry original request
    //   } catch (refreshError) {
    //     console.error("Refresh token failed", refreshError);
    //     // optionally log out user or clear memory token
    //   }
    // }

    return Promise.reject(error);
  }
);

export default axiosInstance;