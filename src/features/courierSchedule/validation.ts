type Row = {
  day: string;
  start: string;
  end: string;
};

const toMinutes = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

export const hasMinFiveDays = (rows: Row[]) => {
  const unique = new Set(rows.map((r) => r.day));
  return unique.size >= 5;
};

export const hasOverlap = (rows: Row[]) => {
  const grouped: Record<string, Row[]> = {};

  rows.forEach((r) => {
    if (!grouped[r.day]) grouped[r.day] = [];
    grouped[r.day].push(r);
  });

  for (const day in grouped) {
    const items = grouped[day];

    for (let i = 0; i < items.length; i++) {
      for (let j = i + 1; j < items.length; j++) {
        const a = items[i];
        const b = items[j];

        if (
          toMinutes(a.start) < toMinutes(b.end) &&
          toMinutes(b.start) < toMinutes(a.end)
        ) {
          return true;
        }
      }
    }
  }

  return false;
};
