import { DAYS } from "../../utils/date";

export const DayRow = () => (
  <div className="flex gap-5 mb-3 mt-3">
    {DAYS.map((day) => (
      <span className="flex items-center flex-1 text-center">{day}</span>
    ))}
  </div>
);
