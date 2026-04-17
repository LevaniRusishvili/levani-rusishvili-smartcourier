import { api } from "./api";

export const getUsers = async () => {
  const { data } = await api.get("/resource/users");
  return data;
};

export const getCouriers = async () => {
  const { data } = await api.get("/resource/couriers");
  return data;
};

export const deleteUser = async (id: number) => {
  const { data } = await api.delete(`/resource/users/${id}`);
  return data;
};

export const updateCourier = async (id: number, body: any) => {
  const { data } = await api.put(`/resource/couriers/${id}`, body);
  return data;
};
