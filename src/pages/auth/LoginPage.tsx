import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginApi } from "../../features/auth/api";
import { useAuthStore } from "../../app/store/auth.store";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  const handleLogin = async () => {
    const res = await loginApi(email, password);

    console.log("LOGIN SUCCESS:", res);

    const user = res.user;
    const token = res.token;

    login(user, token);

    if (user.role === "admin") navigate("/admin");
    else if (user.role === "courier") navigate("/courier");
    else navigate("/user");
  };

  return (
    <div className="p-6">
      <h2>LOGIN</h2>

      <input
        className="border p-2 block mb-2"
        placeholder="email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="border p-2 block mb-2"
        placeholder="password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        className="bg-blue-500 text-white px-4 py-2"
        onClick={handleLogin}
      >
        Login
      </button>
    </div>
  );
}
