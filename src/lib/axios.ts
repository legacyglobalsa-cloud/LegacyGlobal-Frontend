import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Important for cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to handle different content types and add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    // Add access token to headers if available
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // If data is FormData, let browser set Content-Type with boundary
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - simplified, let AuthGuard handle redirects
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Just pass through errors - AuthGuard will handle 401s and redirect if needed
    // This prevents the interceptor from clearing tokens prematurely
    return Promise.reject(error);
  }
);

export default axiosInstance;
