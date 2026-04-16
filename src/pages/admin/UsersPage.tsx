import { useUserStore } from "../../app/stores/user.store";

export default function UsersPage() {
  const users = useUserStore((s) => s.users);

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Users</h1>

      {users.map((u) => (
        <div key={u.id} className="p-3 border rounded mb-2">
          <p>{u.email}</p>
          <p>{u.role}</p>
        </div>
      ))}
    </div>
  );
}
