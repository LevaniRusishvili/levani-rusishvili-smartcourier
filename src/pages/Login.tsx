// src/pages/Login.tsx
import React, { useState } from "react";
import { useAuthStore } from "../stores/authStore";
import { AdminForm } from "../components/forms/AdminForm";
import { UserForm } from "../components/forms/UserForm";
import { CourierForm } from "../components/forms/CourierForm";

type Role = "admin" | "user" | "courier";

export const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [selectedRole, setSelectedRole] = useState<Role>("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading, error } = useAuthStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (err) {
      console.error("Login failed", err);
    }
  };

  const renderRegistrationForm = () => {
    switch (selectedRole) {
      case "admin":
        return <AdminForm />;
      case "user":
        return <UserForm />;
      case "courier":
        return <CourierForm />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdfbf7] to-[#f4f1ea] flex items-center justify-center p-8">
      <div className="w-full max-w-5xl">
        <div className="bg-white rounded-3xl shadow-2xl shadow-black/5 overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-2/5 bg-[#2c3e2f] p-10 text-white">
              <div className="h-full flex flex-col justify-between">
                <div>
                  <div className="text-5xl mb-4">📮</div>
                  <h1 className="text-3xl font-light tracking-wide mb-3">
                    SmartCourier
                  </h1>
                  <p className="text-white/70 text-base leading-relaxed">
                    Intelligent delivery management for modern logistics
                  </p>
                </div>
                <div className="mt-12">
                  <div className="text-xs text-white/40">
                    © 2026 SmartCourier
                  </div>
                </div>
              </div>
            </div>

            <div className="md:w-3/5 p-10">
              <div className="flex gap-3 mb-10 bg-[#f8f6f2] p-1.5 rounded-2xl">
                <button
                  onClick={() => setIsLogin(true)}
                  className={`flex-1 py-3.5 rounded-xl text-base font-medium transition-all ${
                    isLogin
                      ? "bg-white text-[#2c3e2f] shadow-md"
                      : "text-[#8b9a8b] hover:text-[#2c3e2f]"
                  }`}
                >
                  Sign in
                </button>
                <button
                  onClick={() => setIsLogin(false)}
                  className={`flex-1 py-3.5 rounded-xl text-base font-medium transition-all ${
                    !isLogin
                      ? "bg-white text-[#2c3e2f] shadow-md"
                      : "text-[#8b9a8b] hover:text-[#2c3e2f]"
                  }`}
                >
                  Create account
                </button>
              </div>

              {!isLogin && (
                <div className="mb-8">
                  <label className="block text-sm font-medium text-[#6b7c6b] mb-3">
                    Account type
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: "user", name: "User", desc: "Regular customer" },
                      {
                        id: "courier",
                        name: "Courier",
                        desc: "Delivery partner",
                      },
                      { id: "admin", name: "Admin", desc: "Platform manager" },
                    ].map((role) => (
                      <button
                        key={role.id}
                        onClick={() => setSelectedRole(role.id as Role)}
                        className={`py-3 rounded-xl text-center transition-all ${
                          selectedRole === role.id
                            ? "bg-[#2c3e2f] text-white shadow-md"
                            : "bg-[#f8f6f2] text-[#6b7c6b] hover:bg-[#efede8]"
                        }`}
                      >
                        <div className="font-medium text-sm">{role.name}</div>
                        <div className="text-xs mt-0.5 opacity-70">
                          {role.desc}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {isLogin ? (
                <form onSubmit={handleLogin} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-[#6b7c6b] mb-2">
                      Email address
                    </label>
                    <input
                      type="email"
                      placeholder="hello@smartcourier.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-5 py-3.5 rounded-xl bg-[#f8f6f2] border-0 text-[#2c3e2f] placeholder:text-[#c4cdc4] focus:outline-none focus:ring-2 focus:ring-[#2c3e2f]/20 text-base"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#6b7c6b] mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-5 py-3.5 rounded-xl bg-[#f8f6f2] border-0 text-[#2c3e2f] placeholder:text-[#c4cdc4] focus:outline-none focus:ring-2 focus:ring-[#2c3e2f]/20 text-base"
                      required
                    />
                  </div>
                  {error && (
                    <div className="bg-rose-50 text-rose-600 text-sm p-3 rounded-xl">
                      {error}
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#2c3e2f] hover:bg-[#3a4e3d] text-white py-3.5 rounded-xl font-medium transition text-base"
                  >
                    {isLoading ? "Signing in..." : "Sign in"}
                  </button>
                </form>
              ) : (
                renderRegistrationForm()
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
