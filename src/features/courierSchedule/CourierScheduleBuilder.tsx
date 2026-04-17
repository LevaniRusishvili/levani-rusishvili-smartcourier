import { generateTimeSlots } from "./utils";
import { useCourierSchedule } from "./useCourierSchedule";

const days = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

export default function CourierScheduleBuilder() {
  const { rows, addRow, updateRow, removeRow, isValid } = useCourierSchedule();

  const timeSlots = generateTimeSlots();

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Courier Schedule Builder</h1>

      {rows.map((row) => (
        <div
          key={row.id}
          className="flex gap-2 items-center border p-2 rounded"
        >
          {/* DAY */}
          <select
            className="border p-2"
            value={row.day}
            onChange={(e) => updateRow(row.id, "day", e.target.value)}
          >
            {days.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          {/* START */}
          <select
            className="border p-2"
            value={row.start}
            onChange={(e) => updateRow(row.id, "start", e.target.value)}
          >
            {timeSlots.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          {/* END */}
          <select
            className="border p-2"
            value={row.end}
            onChange={(e) => updateRow(row.id, "end", e.target.value)}
          >
            {timeSlots.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <button
            className="bg-red-500 text-white px-2 py-1 rounded"
            onClick={() => removeRow(row.id)}
          >
            X
          </button>
        </div>
      ))}

      <button
        onClick={addRow}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        + Add Day
      </button>

      {!isValid() && (
        <p className="text-red-500">
          Minimum 5 unique days + no overlapping allowed
        </p>
      )}

      {isValid() && rows.length > 0 && (
        <p className="text-green-600">Schedule is valid ✔</p>
      )}
    </div>
  );
}
