import { Navigate } from "react-router-dom";
import { useAuthStore } from "../app/stores/auth.store";

export const ProtectedRoute = ({
  role,
  children,
}: {
  role: "admin" | "user" | "courier";
  children: React.ReactNode;
}) => {
  const user = useAuthStore((s) => s.user);

  if (!user) return <Navigate to="/login" />;
  if (user.role !== role) return <Navigate to="/login" />;

  return children;
};
