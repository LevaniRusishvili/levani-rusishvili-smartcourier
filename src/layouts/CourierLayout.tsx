import { Outlet, Link } from "react-router-dom";

export default function CourierLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-60 bg-white border-r p-4">
        <h2 className="font-bold mb-4">Courier</h2>

        <nav className="flex flex-col gap-2">
          <Link to="/courier">Dashboard</Link>
          <Link to="/courier/schedule">Schedule</Link>
        </nav>
      </aside>

      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
