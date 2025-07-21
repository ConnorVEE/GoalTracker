import CalendarDay from "./CalendarDay";
import { generateMonthGrid, generateWeekGrid } from "../../utils/calendarUtils";

export default function CalendarGrid({ currentDate, view, tasksByDate, onDayClick }) {
  const dayObjects = view === "month"
    ? generateMonthGrid(currentDate)
    : generateWeekGrid(currentDate);

  return (
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
  );
}