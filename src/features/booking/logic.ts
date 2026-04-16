type Booking = {
  id: string;
  userId: string;
  courierId: string;
  day: string;
  start: string;
  end: string;
};

const toMinutes = (time: string) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

export const isTimeConflict = (newBooking: Booking, existing: Booking[]) => {
  return existing.some((b) => {
    if (b.courierId !== newBooking.courierId) return false;
    if (b.day !== newBooking.day) return false;

    const aStart = toMinutes(newBooking.start);
    const aEnd = toMinutes(newBooking.end);
    const bStart = toMinutes(b.start);
    const bEnd = toMinutes(b.end);

    return aStart < bEnd && bStart < aEnd;
  });
};

export const createBooking = (newBooking: Booking, existing: Booking[]) => {
  if (isTimeConflict(newBooking, existing)) {
    return {
      success: false,
      message: "Courier is busy at this time",
    };
  }

  return {
    success: true,
    data: [...existing, newBooking],
  };
};
