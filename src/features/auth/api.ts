import { api } from "../../services/api";

export const loginApi = async (data: { email: string; password: string }) => {
  const res = await api.post("/auth/login", data);
  return res.data;
};

export const registerApi = async (data: any) => {
  const res = await api.post("/auth/register", data);
  return res.data;
};
