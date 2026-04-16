export default function AdminDashboard() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 shadow rounded">Users</div>
        <div className="bg-white p-4 shadow rounded">Couriers</div>
        <div className="bg-white p-4 shadow rounded">Bookings</div>
      </div>
    </div>
  );
}
