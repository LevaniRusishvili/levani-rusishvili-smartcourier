import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:5000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const apiKey = import.meta.env.VITE_API_KEY;

  if (apiKey) {
    config.headers["x-api-key"] = apiKey;
  }

  return config;
});
