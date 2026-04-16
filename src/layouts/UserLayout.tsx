import { Outlet, Link } from "react-router-dom";

export default function UserLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow p-4 flex justify-between">
        <h1 className="font-bold">User Panel</h1>

        <nav className="flex gap-4">
          <Link to="/user">Dashboard</Link>
          <Link to="/user/couriers">Couriers</Link>
        </nav>
      </header>

      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}
