import { useBookingStore } from "../../app/store/booking.store";
import { useAuthStore } from "../../app/store/auth.store";

const couriers = [
  { id: 1, name: "Courier A" },
  { id: 2, name: "Courier B" },
];

export default function CourierListPage() {
  const user = useAuthStore((s) => s.user);
  const addBooking = useBookingStore((s) => s.addBooking);

  const handleBook = (courierId: number) => {
    const res = addBooking({
      id: crypto.randomUUID(),
      userId: user!.id,
      courierId,
      day: "monday",
      start: "10:00",
      end: "11:00",
    });

    if (!res.success) {
      alert(res.message);
    } else {
      alert("Booked successfully ✔");
    }
  };

  return (
    <div className="p-6 space-y-3">
      <h1 className="text-xl font-bold">Couriers</h1>

      {couriers.map((c) => (
        <div key={c.id} className="border p-3 rounded flex justify-between">
          <span>{c.name}</span>

          <button
            className="bg-blue-500 text-white px-3 py-1 rounded"
            onClick={() => handleBook(c.id)}
          >
            Book
          </button>
        </div>
      ))}
    </div>
  );
}
