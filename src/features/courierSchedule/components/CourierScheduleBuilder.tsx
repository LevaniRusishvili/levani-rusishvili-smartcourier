import { generateTimeSlots } from "../../../shared/utils/timeSlots";
import { useCourierSchedule } from "../hooks";

const days = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

export const CourierScheduleBuilder = ({
  courierId,
}: {
  courierId: string;
}) => {
  const { schedule, addRow, removeRow, updateRow, isValid } =
    useCourierSchedule(courierId);

  const timeSlots = generateTimeSlots();

  const valid = isValid();

  return (
    <div style={{ padding: 20 }}>
      <h2>Courier Working Schedule</h2>

      {schedule.map((row) => (
        <div
          key={row.id}
          style={{ display: "flex", gap: 10, marginBottom: 10 }}
        >
          <select
            value={row.day}
            onChange={(e) => updateRow(row.id, "day", e.target.value)}
          >
            {days.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          <select
            value={row.start}
            onChange={(e) => updateRow(row.id, "start", e.target.value)}
          >
            {timeSlots.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <select
            value={row.end}
            onChange={(e) => updateRow(row.id, "end", e.target.value)}
          >
            {timeSlots.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <button onClick={() => removeRow(row.id)}>❌</button>
        </div>
      ))}

      <button onClick={addRow}>➕ Add Day</button>

      <div style={{ marginTop: 20 }}>
        {!valid && (
          <p style={{ color: "red" }}>
            მინიმუმ 5 დღე + დროების გადაფარვა არ შეიძლება
          </p>
        )}
      </div>
    </div>
  );
};
