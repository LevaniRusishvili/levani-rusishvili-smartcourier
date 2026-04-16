import { useAuthStore } from "../../app/stores/auth.store";

export default function UserDashboard() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">User Dashboard</h1>

      <div className="mt-4 bg-white shadow p-4 rounded">
        <p>
          <b>Email:</b> {user?.email}
        </p>
        <p>
          <b>Role:</b> {user?.role}
        </p>
      </div>
    </div>
  );
}
