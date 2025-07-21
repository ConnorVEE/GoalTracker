import CalendarDay from "./CalendarDay";
import { generateMonthGrid, generateWeekGrid } from "../../utils/dateUtils";

export default function CalendarGrid({ currentDate, view, tasksByDate, onDayClick}) {

const grid = view === "month"
  ? generateMonthGrid(currentDate)
  : generateWeekGrid(currentDate);

    return (
        <div className={`grid gap-1 ${
            view === "month" ? "grid-cols-7 grid-rows-6" : "grid-cols-7 grid-rows-1"
        }`}>
            {grid.map((date) => {
            const key = date.toISOString().split("T")[0];
            const tasks = tasksByDate?.[key] || [];

            return (
                <CalendarDay
                key={key}
                date={date}
                tasks={tasks}
                onClick={() => onDayClick(date)}
                isCurrentMonth={date.getMonth() === currentDate.getMonth()}
                />
            );
            })}
        </div>
    );

}