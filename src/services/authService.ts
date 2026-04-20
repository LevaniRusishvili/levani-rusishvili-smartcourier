// src/services/authService.ts
import api from "./api";

export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  },

  register: async (userData: any) => {
    // Remove Authorization header for registration
    // Create a new axios instance without the interceptor for this specific call
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/auth/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": import.meta.env.VITE_API_KEY || "YXBpS2V5U2VjcmV0",
        },
        body: JSON.stringify(userData),
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw error;
    }

    return response.json();
  },

  updateProfile: async (data: any) => {
    const response = await api.patch("/users/profile", data);
    return response.data;
  },
};
