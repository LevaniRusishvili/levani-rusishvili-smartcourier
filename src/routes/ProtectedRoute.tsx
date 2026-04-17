import { Navigate } from "react-router-dom";
import { useAuthStore } from "../app/store/auth.store";

export default function ProtectedRoute({
  children,
  role,
}: {
  children: React.ReactNode;
  role?: "admin" | "user" | "courier";
}) {
  const user = useAuthStore((s) => s.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
