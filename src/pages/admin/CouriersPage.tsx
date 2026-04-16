import { useCourierStore } from "../../app/stores/courier.store";

export default function CouriersPage() {
  const couriers = useCourierStore((s) => s.couriers);

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Couriers</h1>

      {couriers.map((c) => (
        <div key={c.id} className="p-3 border rounded mb-2">
          <p>{c.email}</p>
          <p>{c.vehicle}</p>
        </div>
      ))}
    </div>
  );
}
