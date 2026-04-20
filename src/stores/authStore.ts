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

// Helper to save user to local storage
const saveUserToLocalStorage = (userData: any) => {
  const existingUsers = JSON.parse(
    localStorage.getItem("smartcourier_users") || "[]",
  );
  const userExists = existingUsers.some((u: any) => u.email === userData.email);

  if (!userExists) {
    const newUser = {
      id: Date.now(),
      firstName: userData.firstName,
      lastName: userData.lastName || "",
      email: userData.email,
      phoneNumber: userData.phoneNumber || "",
      pid: userData.pid || "",
      role: userData.role || "user",
      vehicle: userData.vehicle || "",
      workingDays: userData.workingDays || {},
      address: userData.address || null,
      createdAt: new Date().toISOString(),
    };
    existingUsers.push(newUser);
    localStorage.setItem("smartcourier_users", JSON.stringify(existingUsers));
    console.log("User saved to localStorage:", newUser);
  }
};

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
          console.log("🔐 LOGIN RESPONSE:", response);

          let userWithRole = response.user;

          const savedRole = get().registeredRole;

          if (savedRole) {
            userWithRole = { ...userWithRole, role: savedRole };
          } else if (!userWithRole.role) {
            if (email.toLowerCase().includes("admin")) {
              userWithRole = { ...userWithRole, role: "admin" };
              console.log("📌 Assigned role: admin (based on email)");
            } else if (email.toLowerCase().includes("courier")) {
              userWithRole = { ...userWithRole, role: "courier" };
              console.log("📌 Assigned role: courier (based on email)");
            } else {
              userWithRole = { ...userWithRole, role: "user" };
              console.log("📌 Assigned role: user (default)");
            }
          }

          console.log("✅ FINAL USER WITH ROLE:", userWithRole);

          set({
            user: userWithRole,
            accessToken: response.credentials.accessToken,
            refreshToken: response.credentials.refreshToken,
            isLoading: false,
          });

          const role = userWithRole.role;
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

          console.log("📝 Registering user:", userData);

          const response = await authService.register(userData);
          console.log("✅ Registration response:", response);

          // Save user to local storage for admin dashboard
          saveUserToLocalStorage({ ...userData, id: response.user?.id });

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
        // Save calls before clearing auth
        const savedCalls = localStorage.getItem("smartcourier_calls");

        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          registeredRole: null,
        });

        // Only remove auth storage, keep calls
        localStorage.removeItem("auth-storage");

        // Restore calls if they existed
        if (savedCalls) {
          localStorage.setItem("smartcourier_calls", savedCalls);
          console.log("✅ Calls preserved during logout");
        }

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
