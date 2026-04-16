import { create } from "zustand";

type User = {
  id: string;
  firstName: string;
  lastName?: string;
  email: string;
  role: "admin" | "user" | "courier";
};

type State = {
  users: User[];
  addUser: (u: User) => void;
};

export const useUserStore = create<State>((set) => ({
  users: [],
  addUser: (u) =>
    set((s) => ({
      users: [...s.users, u],
    })),
}));
