import { create } from "zustand";

type Role = "admin" | "user" | "courier";

type User = {
  id: string;
  email: string;
  role: Role;
};

type AuthState = {
  user: User | null;
  token: string | null;

  login: (data: { user: User; token: string }) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,

  login: ({ user, token }) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    set({ user, token });
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    set({ user: null, token: null });
  },
}));
export const initAuth = () => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  if (token && user) {
    return {
      token,
      user: JSON.parse(user),
    };
  }

  return null;
};