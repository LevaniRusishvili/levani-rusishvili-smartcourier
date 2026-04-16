import { useState } from "react";
import { useAuthStore } from "../../app/stores/auth.store";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"admin" | "user" | "courier">("user");

  const handleLogin = () => {
    login({
      id: crypto.randomUUID(),
      email,
      role,
    });

    navigate(`/${role}`);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Login</h2>

      <input
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <select value={role} onChange={(e) => setRole(e.target.value as any)}>
        <option value="admin">Admin</option>
        <option value="user">User</option>
        <option value="courier">Courier</option>
      </select>

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
