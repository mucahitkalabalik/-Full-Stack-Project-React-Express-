import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api"; // API URL'ni buraya ekle

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    if (config.url !== "/users/register" || config.url !== "/users/login") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    console.log(config, "config");

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
