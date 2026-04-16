import { create } from "zustand";
import { createBooking } from "../../features/booking/logic";

type Booking = {
  id: string;
  userId: string;
  courierId: string;
  day: string;
  start: string;
  end: string;
};

type State = {
  bookings: Booking[];
  addBooking: (b: Booking) => { success: boolean; message?: string };
};

export const useBookingStore = create<State>((set, get) => ({
  bookings: [],

  addBooking: (b) => {
    const existing = get().bookings;

    const result = createBooking(b, existing);

    if (!result.success) return result;

    set({ bookings: result.data });

    return { success: true };
  },
}));
