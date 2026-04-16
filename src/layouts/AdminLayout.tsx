import { Outlet, Link } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-4">
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>

        <nav className="flex flex-col gap-3">
          <Link className="hover:text-blue-500" to="/admin">
            Dashboard
          </Link>
          <Link className="hover:text-blue-500" to="/admin/users">
            Users
          </Link>
          <Link className="hover:text-blue-500" to="/admin/couriers">
            Couriers
          </Link>
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
