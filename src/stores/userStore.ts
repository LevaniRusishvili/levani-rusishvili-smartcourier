// src/stores/authStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authService } from "../services/authService";
import type { Admin, Courier, User } from "../types";

interface AuthState {
  user: Admin | User | Courier | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;
  registeredRole: string | null;

  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<Admin | User | Courier>) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isLoading: false,
      error: null,
      registeredRole: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.login(email, password);

          let userWithRole = response.user;

          // First check saved role from registration
          const savedRole = get().registeredRole;

          if (savedRole) {
            userWithRole = { ...userWithRole, role: savedRole };
          }
          // Then check email pattern
          else if (!userWithRole.role) {
            if (email.toLowerCase().includes("admin")) {
              userWithRole = { ...userWithRole, role: "admin" };
            } else if (email.toLowerCase().includes("courier")) {
              userWithRole = { ...userWithRole, role: "courier" };
            } else {
              userWithRole = { ...userWithRole, role: "user" };
            }
          }

          console.log("User with role:", userWithRole); // Debug log

          set({
            user: userWithRole,
            accessToken: response.credentials.accessToken,
            refreshToken: response.credentials.refreshToken,
            isLoading: false,
          });

          const role = userWithRole.role;
          console.log("Redirecting to:", `/${role}/dashboard`); // Debug log
          window.location.href = `/${role}/dashboard`;
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message || error.message || "Login failed";
          set({ error: errorMessage, isLoading: false });
          console.error("Login error:", errorMessage);
        }
      },

      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const role = userData.role || "user";
          set({ registeredRole: role });

          const response = await authService.register(userData);

          let userWithRole = response.user;
          if (!userWithRole.role) {
            userWithRole = { ...userWithRole, role: role };
          }

          set({
            user: userWithRole,
            accessToken: response.credentials.accessToken,
            refreshToken: response.credentials.refreshToken,
            isLoading: false,
          });

          window.location.href = `/${role}/dashboard`;
        } catch (error: any) {
          console.error("Register error:", error);
          set({ error: error.message, isLoading: false, registeredRole: null });
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          registeredRole: null,
        });
        localStorage.clear();
        window.location.href = "/login";
      },

      updateProfile: async (data) => {
        set({ isLoading: true });
        try {
          const updatedUser = await authService.updateProfile(data);
          set({ user: updatedUser, isLoading: false });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
        registeredRole: state.registeredRole,
      }),
    },
  ),
);
