import { api } from "../../services/api";

export const getCouriers = async () => {
  const res = await api.get("/couriers");
  return res.data;
};

export const updateCourier = async (id: string, data: any) => {
  const res = await api.patch(`/couriers/${id}`, data);
  return res.data;
};
