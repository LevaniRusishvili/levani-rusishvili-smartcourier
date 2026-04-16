import { CourierScheduleBuilder } from "../../features/courierSchedule/components/CourierScheduleBuilder";
import { useAuthStore } from "../../app/stores/auth.store";

export default function SchedulePage() {
  const user = useAuthStore((s) => s.user);

  return (
    <div>
      <h1>My Schedule</h1>

      <CourierScheduleBuilder courierId={user!.id} />
    </div>
  );
}
