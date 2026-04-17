import { api } from "../../services/api";

export const getMe = async () => {
  const res = await api.get("/resource/users");
  return res.data;
};
