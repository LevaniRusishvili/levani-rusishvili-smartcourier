import { Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "../pages/auth/LoginPage";

import AdminLayout from "../layouts/AdminLayout";
import UserLayout from "../layouts/UserLayout";
import CourierLayout from "../layouts/CourierLayout";

import AdminDashboard from "../pages/admin/AdminDashboard";
import UserDashboard from "../pages/user/UserDashboard";
import CourierDashboard from "../pages/courier/CourierDashboard";
import ProfilePage from "../pages/user/ProfilePage";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* public */}
      <Route path="/login" element={<LoginPage />} />

      {/* ADMIN */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
      </Route>

      {/* USER */}
      <Route path="/user" element={<UserLayout />}>
        <Route index element={<UserDashboard />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      {/* COURIER */}
      <Route path="/courier" element={<CourierLayout />}>
        <Route index element={<CourierDashboard />} />
      </Route>

      {/* fallback */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};
