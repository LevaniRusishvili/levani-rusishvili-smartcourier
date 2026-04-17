import { create } from "zustand";
import { hasConflict } from "../../features/booking/logic";

type Booking = {
  id: string;
  userId: number;
  courierId: number;
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

    if (hasConflict(b, existing)) {
      return {
        success: false,
        message: "Courier already booked in this time slot",
      };
    }

    set({ bookings: [...existing, b] });

    return { success: true };
  },
}));
