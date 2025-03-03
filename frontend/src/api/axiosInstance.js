import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost:8000/api",  // Update this if your backend URL is different
    withCredentials: true,  
    headers: {
        "Content-Type": "application/json",
    },
});

export default axiosInstance;
