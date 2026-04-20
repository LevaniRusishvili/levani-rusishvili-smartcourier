// src/TestLogin.tsx (temporary)
import React, { useState } from "react";
import api from "./services/api";

export const TestLogin: React.FC = () => {
  const [email, setEmail] = useState("levanirusishvili5@gmail.com");
  const [password, setPassword] = useState("baklajan1234567");
  const [result, setResult] = useState("");

  const testLogin = async () => {
    try {
      const response = await api.post("/auth/login", { email, password });
      setResult(JSON.stringify(response.data, null, 2));
      console.log("Success:", response.data);
    } catch (error: any) {
      setResult(error.response?.data?.message || error.message);
      console.error("Error:", error.response?.data);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Test Login</h1>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="block border p-2 mb-2 w-full"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="block border p-2 mb-2 w-full"
      />
      <button
        onClick={testLogin}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Test Login
      </button>
      <pre className="mt-4 p-4 bg-gray-100 rounded overflow-auto">{result}</pre>
    </div>
  );
};
