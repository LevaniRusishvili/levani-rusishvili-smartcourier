import { api } from "../services/api";

export const runAuthTest = async () => {
  console.log("TOKEN CHECK:", localStorage.getItem("accessToken"));

  try {
    const res = await api.get("/resource/users");
    console.log("RESOURCE SUCCESS:", res.data);
  } catch (err: any) {
    console.log("RESOURCE ERROR:", err.response?.data || err.message);
  }
};
