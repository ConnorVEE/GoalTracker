import CalendarDay from "./CalendarDay";
import { generateMonthGrid, generateWeekGrid } from "../../utils/calendarUtils";

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function CalendarGrid({ currentDate, view, tasksByDate, onDayClick }) {
  const dayObjects = view === "month"
    ? generateMonthGrid(currentDate)
    : generateWeekGrid(currentDate);

  return (
    <div className="space-y-2">
      
      {/* Weekday Labels */}
      <div className="grid grid-cols-7 text-center text-sm text-gray-500 font-medium">
        {weekdays.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* Line separator */}
      <div className="border-t border-gray-400 pt-2 space-y-2">

        {/* Calendar Grid */}
        <div className={`grid gap-1 ${view === "month" ? "grid-cols-7 grid-rows-6" : "grid-cols-7 grid-rows-1"}`}>
          {dayObjects.map(({ date, fullDate, isCurrentMonth }) => {
            const tasks = tasksByDate?.[date] || [];

            return (
              <CalendarDay
                key={date}
                date={fullDate}
                tasks={tasks}
                onClick={() => onDayClick(fullDate)}
                isCurrentMonth={isCurrentMonth}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}