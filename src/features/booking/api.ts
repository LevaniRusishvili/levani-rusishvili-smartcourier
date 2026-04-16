import { api } from "../../services/api";

export const createBookingApi = async (data: any) => {
  const res = await api.post("/bookings", data);
  return res.data;
};

export const getBookings = async () => {
  const res = await api.get("/bookings");
  return res.data;
};
