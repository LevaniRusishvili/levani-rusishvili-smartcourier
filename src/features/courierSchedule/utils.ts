export const generateTimeSlots = () => {
  const slots: string[] = [];

  for (let h = 0; h < 24; h++) {
    slots.push(`${String(h).padStart(2, "0")}:00`);
    slots.push(`${String(h).padStart(2, "0")}:30`);
  }

  return slots;
};

type Row = {
  id: string;
  day: string;
  start: string;
  end: string;
};

export const hasMinFiveDays = (schedule: Row[]) => {
  const uniqueDays = new Set(schedule.map((s) => s.day));
  return uniqueDays.size >= 5;
};

// ✅ ONLY ONCE
const toMinutes = (time: string) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

// ✅ ONLY ONCE
export const hasOverlap = (
  schedule: { day: string; start: string; end: string }[],
) => {
  const grouped: Record<string, typeof schedule> = {};

  schedule.forEach((item) => {
    if (!grouped[item.day]) grouped[item.day] = [];
    grouped[item.day].push(item);
  });

  for (const day in grouped) {
    const items = grouped[day];

    for (let i = 0; i < items.length; i++) {
      for (let j = i + 1; j < items.length; j++) {
        const a = items[i];
        const b = items[j];

        const overlap =
          toMinutes(a.start) < toMinutes(b.end) &&
          toMinutes(b.start) < toMinutes(a.end);

        if (overlap) return true;
      }
    }
  }

  return false;
};
