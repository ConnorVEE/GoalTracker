import { format, isToday } from "date-fns";

export default function CalendarDay({ date, tasks, onClick, isCurrentMonth }) {
  const dayNum = format(date, "d"); // just the number, e.g. "12"

  return (
    <button
      onClick={onClick}
      className={`
        p-2 rounded-md w-full h-20 flex flex-col items-start justify-start
        text-left border hover:bg-purple-100 transition
        ${!isCurrentMonth ? "text-gray-400 bg-gray-300" : "text-gray-500"}
        ${isToday(date) ? "border-purple-500 border-2" : "border-gray-200"}
      `}
    >
      <span className="text-sm font-semibold">{dayNum}</span>
      {/* Placeholder for future task indicators */}
    </button>
  );
}