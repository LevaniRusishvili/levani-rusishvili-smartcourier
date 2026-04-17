import { api } from "../../services/api";

export const loginApi = async (email: string, password: string) => {
  const { data } = await api.post("/auth/login", {
    email,
    password,
  });

  const user = {
    id: data.user.id,
    email: data.user.email,
    firstName: data.user.firstName,
    lastName: data.user.lastName,
    role: data.user.role || "user",
  };

  const token = data.credentials.accessToken;

  localStorage.setItem("accessToken", token);
  localStorage.setItem("user", JSON.stringify(user));

  return { user, token };
};
