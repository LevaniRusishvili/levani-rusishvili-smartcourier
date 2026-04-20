// src/components/courier/WorkingDaysInput.tsx
import React, { useState } from "react";
import type { WorkingDays } from "../../types";

interface WorkingDaysInputProps {
  value: WorkingDays;
  onChange: (workingDays: WorkingDays) => void;
}

const weekDays = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const timeOptions = Array.from({ length: 48 }, (_, i) => {
  const hour = Math.floor(i / 2);
  const minute = i % 2 === 0 ? "00" : "30";
  return `${hour.toString().padStart(2, "0")}:${minute}`;
});

export const WorkingDaysInput: React.FC<WorkingDaysInputProps> = ({
  value,
  onChange,
}) => {
  const [selectedDay, setSelectedDay] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");

  const addWorkingDay = () => {
    if (!selectedDay) return;

    const newWorkingDays: WorkingDays = {
      ...value,
      [selectedDay]: { startHours: startTime, endHours: endTime },
    };
    onChange(newWorkingDays);
    setSelectedDay("");
  };

  const removeWorkingDay = (day: string) => {
    const newWorkingDays = { ...value };
    delete newWorkingDays[day as keyof WorkingDays];
    onChange(newWorkingDays);
  };

  const workingDaysCount = Object.keys(value).length;
  const isValid = workingDaysCount >= 5;

  return (
    <div className="space-y-4 p-5 rounded-xl bg-[#f8f6f2] border border-[#e8e0d5]">
      <div className="flex gap-3 flex-wrap items-center">
        <select
          value={selectedDay}
          onChange={(e) => setSelectedDay(e.target.value)}
          className="flex-1 min-w-[140px] px-4 py-3 rounded-lg bg-white border border-[#e8e0d5] text-[#3a2c24] text-base focus:outline-none focus:ring-2 focus:ring-[#3a2c24]/20 cursor-pointer"
        >
          <option value="">Select day</option>
          {weekDays.map((day) => (
            <option
              key={day}
              value={day}
              disabled={!!value[day as keyof WorkingDays]}
              className="bg-white"
            >
              {day.charAt(0).toUpperCase() + day.slice(1)}
            </option>
          ))}
        </select>

        <select
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="px-4 py-3 rounded-lg bg-white border border-[#e8e0d5] text-[#3a2c24] text-base focus:outline-none focus:ring-2 focus:ring-[#3a2c24]/20 cursor-pointer"
        >
          {timeOptions.map((time) => (
            <option key={time} value={time}>
              {time}
            </option>
          ))}
        </select>

        <span className="text-[#b8a99a] text-base">to</span>

        <select
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className="px-4 py-3 rounded-lg bg-white border border-[#e8e0d5] text-[#3a2c24] text-base focus:outline-none focus:ring-2 focus:ring-[#3a2c24]/20 cursor-pointer"
        >
          {timeOptions.map((time) => (
            <option key={time} value={time}>
              {time}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={addWorkingDay}
          className="px-5 py-3 rounded-lg bg-[#3a2c24] hover:bg-[#5a4438] text-white text-base font-medium transition cursor-pointer"
        >
          Add
        </button>
      </div>

      {Object.keys(value).length > 0 && (
        <div className="space-y-2 mt-4">
          {Object.entries(value).map(([day, hours]) => (
            <div
              key={day}
              className="flex justify-between items-center bg-white p-3 rounded-lg border border-[#e8e0d5]"
            >
              <span className="font-medium text-[#3a2c24] text-base">
                {day.charAt(0).toUpperCase() + day.slice(1)}
              </span>
              <span className="text-[#8b7a6b] text-base">
                {hours.startHours} - {hours.endHours}
              </span>
              <button
                type="button"
                onClick={() => removeWorkingDay(day)}
                className="text-[#c4a4a4] hover:text-[#c45a4a] transition text-sm cursor-pointer"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      {!isValid && (
        <p className="text-amber-700 text-sm mt-3 bg-amber-50 p-3 rounded-lg">
          ⚠️ Minimum 5 working days required. Currently: {workingDaysCount}/5
        </p>
      )}

      {isValid && workingDaysCount > 0 && (
        <p className="text-green-700 text-sm mt-3 bg-green-50 p-3 rounded-lg">
          ✅ Great! You have {workingDaysCount} working days configured.
        </p>
      )}
    </div>
  );
};
