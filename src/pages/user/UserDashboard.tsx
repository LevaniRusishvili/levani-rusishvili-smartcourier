import { useAuthStore } from "../../app/store/auth.store";

export default function UserDashboard() {
  const user = useAuthStore((s) => s.user);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1>User Dashboard</h1>

      <div className="border p-4 mt-4">
        <p>Email: {user.email}</p>
        <p>
          Name: {user.firstName} {user.lastName}
        </p>
        <p>Role: {user.role}</p>
      </div>
    </div>
  );
}
