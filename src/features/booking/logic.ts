type Booking = {
  id: string;
  userId: number;
  courierId: number;
  day: string;
  start: string;
  end: string;
};

const toMin = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

export const hasConflict = (newB: Booking, list: Booking[]) => {
  return list.some((b) => {
    if (b.courierId !== newB.courierId) return false;
    if (b.day !== newB.day) return false;

    return toMin(newB.start) < toMin(b.end) && toMin(b.start) < toMin(newB.end);
  });
};
