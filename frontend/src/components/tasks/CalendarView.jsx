import { useState, useEffect } from "react";
import { groupTasksByDate, generateMonthGrid, generateWeekGrid } from "../../utils/calendarUtils";
import { getTasksByRange } from "../../api/taskRoutes";
import CalendarToggle from "./CalendarToggle";
import CalendarHeader from "./CalendarHeader";
import CalendarGrid from "./CalendarGrid";
import DayTaskModal from "./DayTaskModal";

export default function CalendarView() {
  const [view, setView] = useState("month");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [tasksByDate, setTasksByDate] = useState({});
  const [isAnimating, setIsAnimating] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);

        // Build the grid first so we know which days are visible
        const grid =
          view === "month"
            ? generateMonthGrid(currentDate)
            : generateWeekGrid(currentDate);

        const start = grid[0].date;
        const end = grid[grid.length - 1].date;

        const res = await getTasksByRange(start, end);

        // Pass both tasks and gridDays
        const grouped = groupTasksByDate(res.data, grid);



        // console.log("API returned tasks:", res.data);



        setTasksByDate(grouped);

      } catch (err) {
        console.error("Failed to load tasks:", err);

      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [view, currentDate]);

  const handleDayClick = (date) => {
    setSelectedDate(date);
  };

  const handleNext = () => {
    const updated = new Date(currentDate);
    if (view === "month") {
      updated.setMonth(updated.getMonth() + 1);
    } else {
      updated.setDate(updated.getDate() + 7);
    }
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentDate(updated);
      setIsAnimating(false);
    }, 500);
  };

  const handlePrev = () => {
    const updated = new Date(currentDate);
    if (view === "month") {
      updated.setMonth(updated.getMonth() - 1);
    } else {
      updated.setDate(updated.getDate() - 7);
    }
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentDate(updated);
      setIsAnimating(false);
    }, 500);
  };

  return (
    <div className="space-y-4">
      <CalendarToggle view={view} setView={setView} />

      <CalendarHeader
        currentDate={currentDate}
        onNext={handleNext}
        onPrev={handlePrev}
        view={view}
      />

      {loading ? (
        <p className="text-center text-gray-500">Loading tasks...</p>
      ) : (
        <div
          className={`transition-opacity duration-500 ${
            isAnimating ? "opacity-0" : "opacity-100"
          }`}
        >
          <CalendarGrid
            currentDate={currentDate}
            view={view}
            tasksByDate={tasksByDate}
            onDayClick={handleDayClick}
          />
        </div>
      )}

      <DayTaskModal
        date={selectedDate}
        tasks={
          selectedDate
            ? tasksByDate[selectedDate.toISOString().split("T")[0]] || []
            : []
        }
        onClose={() => setSelectedDate(null)}
      />
    </div>
  );
}