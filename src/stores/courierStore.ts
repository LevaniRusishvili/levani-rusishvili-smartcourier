import { create } from "zustand";
import api from "../services/api";
import type { Courier } from "../types";

interface CourierState {
  couriers: Courier[];
  isLoading: boolean;
  error: string | null;
  fetchCouriers: () => Promise<void>;
  deleteCourier: (id: number) => Promise<void>;
}

export const useCourierStore = create<CourierState>((set) => ({
  couriers: [],
  isLoading: false,
  error: null,

  fetchCouriers: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get("/couriers");
      set({ couriers: response.data, isLoading: false });
    } catch (error) {
      set({ error: "Failed to fetch couriers", isLoading: false });
    }
  },

  deleteCourier: async (id: number) => {
    try {
      await api.delete(`/couriers/${id}`);
      set((state) => ({
        couriers: state.couriers.filter((courier) => courier.id !== id),
      }));
    } catch (error) {
      console.error("Delete failed:", error);
    }
  },
}));
