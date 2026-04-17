import { useEffect } from "react";
import { getUsers, getCouriers } from "../../services/resource.api";
import { useAdminStore } from "../../app/store/admin.store";

export default function AdminDashboard() {
  const { users, couriers, setUsers, setCouriers, deleteUser, deleteCourier } =
    useAdminStore();

  useEffect(() => {
    const load = async () => {
      const u = await getUsers();
      const c = await getCouriers();

      setUsers(u);
      setCouriers(c);
    };

    load();
  }, []);

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">Admin Panel</h1>

      {/* USERS */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Users</h2>

        <div className="space-y-2">
          {users.map((u) => (
            <div
              key={u.id}
              className="flex justify-between items-center border p-3 rounded"
            >
              <div>
                <p className="font-medium">{u.email}</p>
                <p className="text-sm text-gray-500">{u.role}</p>
              </div>

              <button
                className="bg-red-500 text-white px-3 py-1 rounded"
                onClick={() => deleteUser(u.id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* COURIERS */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Couriers</h2>

        <div className="space-y-2">
          {couriers.map((c) => (
            <div
              key={c.id}
              className="flex justify-between items-center border p-3 rounded"
            >
              <div>
                <p className="font-medium">{c.email}</p>
                <p className="text-sm text-gray-500">{c.vehicle}</p>
              </div>

              <button
                className="bg-red-500 text-white px-3 py-1 rounded"
                onClick={() => deleteCourier(c.id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
