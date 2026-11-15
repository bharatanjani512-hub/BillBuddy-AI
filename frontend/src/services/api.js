import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://billbuddy-ai.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

// Attach JWT Token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Handle common API errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("access_token");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;