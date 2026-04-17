import { useState } from "react";
import { useAuthStore } from "../../app/stores/auth.store";
import { useNavigate } from "react-router-dom";
import { loginApi } from "../../features/auth/api";

export default function LoginPage() {
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [debug, setDebug] = useState<any>(null); // 👈 ეს დაამატე

  const handleLogin = async () => {
    setDebug("CLICKED"); // 👈

    try {
      const res = await loginApi({ email, password });

      setDebug(res); // 👈 აჩვენებს პასუხს ეკრანზე

      login({
        user: res.user,
        token: res.accessToken,
      });

      navigate(`/${res.user.role}`);
    } catch (e: any) {
      setDebug(e.response?.data || e.message); // 👈 error-იც გამოჩნდება
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 gap-4">
      <div className="bg-white p-6 rounded shadow w-80">
        <h2 className="text-xl font-bold mb-4">Login</h2>

        <input
          className="border p-2 w-full mb-3"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="border p-2 w-full mb-3"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="bg-blue-500 text-white w-full p-2 rounded"
        >
          Login
        </button>
      </div>

      {/* 🔥 DEBUG BOX */}
      <div className="bg-black text-green-400 p-4 w-[400px] text-sm rounded">
        <pre>{JSON.stringify(debug, null, 2)}</pre>
      </div>
    </div>
  );
}
