// src/services/api.ts
import axios from "axios";
import { useAuthStore } from "../stores/authStore";

const BASE_URL =
  import.meta.env.VITE_BASE_URL || "http://localhost:5000/api/v1";
const API_KEY = import.meta.env.VITE_API_KEY || "YXBpS2V5U2VjcmV0";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "x-api-key": API_KEY,
  },
});

api.interceptors.request.use(
  (config) => {
    const isAuthEndpoint = config.url?.includes("/auth/");

    if (!isAuthEndpoint) {
      const token = useAuthStore.getState().accessToken;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    config.headers["x-api-key"] = API_KEY;

    return config;
  },
  (error) => Promise.reject(error),
);

export default api;
