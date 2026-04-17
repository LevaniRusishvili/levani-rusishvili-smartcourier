import { useState } from "react";
import { hasMinFiveDays, hasOverlap } from "./validation";

type Row = {
  id: string;
  day: string;
  start: string;
  end: string;
};

export const useCourierSchedule = () => {
  const [rows, setRows] = useState<Row[]>([]);

  const addRow = () => {
    setRows((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        day: "monday",
        start: "09:00",
        end: "10:00",
      },
    ]);
  };

  const updateRow = (id: string, key: keyof Row, value: string) => {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [key]: value } : r)),
    );
  };

  const removeRow = (id: string) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  const isValid = () => {
    return hasMinFiveDays(rows) && !hasOverlap(rows);
  };

  return {
    rows,
    addRow,
    updateRow,
    removeRow,
    isValid,
  };
};
