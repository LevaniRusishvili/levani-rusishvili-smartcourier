import { create } from "zustand";

type User = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: "admin" | "user" | "courier";
};

type Courier = {
  id: number;
  email: string;
  vehicle?: string;
};

type State = {
  users: User[];
  couriers: Courier[];

  setUsers: (u: User[]) => void;
  setCouriers: (c: Courier[]) => void;

  deleteUser: (id: number) => void;
  deleteCourier: (id: number) => void;
};

export const useAdminStore = create<State>((set) => ({
  users: [],
  couriers: [],

  setUsers: (u) => set({ users: u }),
  setCouriers: (c) => set({ couriers: c }),

  deleteUser: (id) =>
    set((state) => ({
      users: state.users.filter((u) => u.id !== id),
    })),

  deleteCourier: (id) =>
    set((state) => ({
      couriers: state.couriers.filter((c) => c.id !== id),
    })),
}));
