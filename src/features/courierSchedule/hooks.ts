import { useCourierStore } from "../../app/stores/courier.store";
import { hasMinFiveDays, hasOverlap } from "./utils";

type Row = {
  id: string;
  day: string;
  start: string;
  end: string;
};

export const useCourierSchedule = (courierId: string) => {
  const courier = useCourierStore((s) =>
    s.couriers.find((c) => c.id === courierId),
  );

  const setSchedule = useCourierStore((s) => s.setSchedule);

  const schedule = courier?.schedule ?? [];

  const addRow = () => {
    setSchedule(courierId, [
      ...schedule,
      {
        id: crypto.randomUUID(),
        day: "monday",
        start: "09:00",
        end: "18:00",
      },
    ]);
  };

  const removeRow = (id: string) => {
    setSchedule(
      courierId,
      schedule.filter((r) => r.id !== id),
    );
  };

  const updateRow = (id: string, key: keyof Row, value: string) => {
    setSchedule(
      courierId,
      schedule.map((r) => (r.id === id ? { ...r, [key]: value } : r)),
    );
  };

  const isValid = () => {
    return hasMinFiveDays(schedule) && !hasOverlap(schedule);
  };

  return {
    schedule,
    addRow,
    removeRow,
    updateRow,
    isValid,
  };
};
