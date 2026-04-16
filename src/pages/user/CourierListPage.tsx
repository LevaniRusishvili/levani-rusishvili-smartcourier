import { useBookingStore } from "../../app/stores/booking.store";
import { useAuthStore } from "../../app/stores/auth.store";

const couriers = [
  {
    id: "1",
    name: "Courier A",
  },
];

export default function CourierListPage() {
  const addBooking = useBookingStore((s) => s.addBooking);
  const user = useAuthStore((s) => s.user);

  const handleBook = (courierId: string) => {
    const result = addBooking({
      id: crypto.randomUUID(),
      userId: user!.id,
      courierId,
      day: "monday",
      start: "10:00",
      end: "11:00",
    });

    if (!result.success) {
      alert(result.message);
    } else {
      alert("Booked successfully");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Couriers</h2>

      {couriers.map((c) => (
        <div key={c.id} style={{ border: "1px solid gray", margin: 10 }}>
          <h3>{c.name}</h3>

          <button onClick={() => handleBook(c.id)}>Book Courier</button>
        </div>
      ))}
    </div>
  );
}
