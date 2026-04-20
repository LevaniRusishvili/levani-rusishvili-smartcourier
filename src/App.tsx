// src/App.tsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./pages/Login";
import { AdminDashboard } from "./pages/AdminDashboard";
import { UserDashboard } from "./pages/UserDashboard";
import { CourierDashboard } from "./pages/CourierDashboard";
import { useAuthStore } from "./stores/authStore";

function App() {
  const { user } = useAuthStore();

  if (!user) {
    return (
      <Routes>
        <Route path="*" element={<Login />} />
      </Routes>
    );
  }

  const role = user.role || "user";

  return (
    <Routes>
      <Route path="/" element={<Navigate to={`/${role}/dashboard`} />} />
      <Route path="/login" element={<Navigate to={`/${role}/dashboard`} />} />
      <Route
        path="/admin/dashboard"
        element={
          role === "admin" ? (
            <AdminDashboard />
          ) : (
            <Navigate to={`/${role}/dashboard`} />
          )
        }
      />
      <Route
        path="/user/dashboard"
        element={
          role === "user" ? (
            <UserDashboard />
          ) : (
            <Navigate to={`/${role}/dashboard`} />
          )
        }
      />
      <Route
        path="/courier/dashboard"
        element={
          role === "courier" ? (
            <CourierDashboard />
          ) : (
            <Navigate to={`/${role}/dashboard`} />
          )
        }
      />
    </Routes>
  );
}

export default App;
