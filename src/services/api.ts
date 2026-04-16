import axios from "axios";

export const api = axios.create({
  baseURL: "https://your-backend.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// optional: token interceptor (მნიშვნელოვანი მომავალში)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
