import { create } from "zustand";

type Row = {
  id: string;
  day: string;
  start: string;
  end: string;
};

type Courier = {
  id: string;
  firstName?: string;
  lastName?: string;
  vehicle?: string;
  email?: string;
  profileImage?: string;
  schedule: Row[];
};

type State = {
  couriers: Courier[];

  addCourier: (c: Courier) => void;
  updateCourier: (id: string, data: Partial<Courier>) => void;

  setSchedule: (courierId: string, schedule: Row[]) => void;
};

export const useCourierStore = create<State>((set) => ({
  couriers: [],

  addCourier: (c) =>
    set((state) => ({
      couriers: [...state.couriers, c],
    })),

  updateCourier: (id, data) =>
    set((state) => ({
      couriers: state.couriers.map((c) =>
        c.id === id ? { ...c, ...data } : c,
      ),
    })),

  setSchedule: (courierId, schedule) =>
    set((state) => ({
      couriers: state.couriers.map((c) =>
        c.id === courierId ? { ...c, schedule } : c,
      ),
    })),
}));
