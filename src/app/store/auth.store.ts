import { create } from "zustand";

export type Role = "admin" | "user" | "courier";

export type User = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
};

type AuthState = {
  user: User | null;
  token: string | null;

  login: (user: User, token: string) => void;
  logout: () => void;
};

const getUserFromStorage = (): User | null => {
  const raw = localStorage.getItem("user");
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const useAuthStore = create<AuthState>((set) => ({
  user: getUserFromStorage(),
  token: localStorage.getItem("accessToken"),

  login: (user, token) => {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("accessToken", token);

    set({ user, token });
  },

  logout: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");

    set({ user: null, token: null });
  },
}));
