import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { groupTasksByDate, generateMonthGrid, generateWeekGrid } from "../../utils/calendarUtils";
import { getTasksByRange } from "../../api/taskRoutes";
import CalendarToggle from "./CalendarToggle";
import CalendarHeader from "./CalendarHeader";
import CalendarGrid from "./CalendarGrid";
import DayTaskModal from "./DayTaskModal";

export default function CalendarView( {onViewChange} ) {

  const [view, setView] = useState("month");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [tasksByDate, setTasksByDate] = useState({});
  const [loading, setLoading] = useState(true);
  const [direction, setDirection] = useState(0); // -1 for prev, +1 for next

  // Effect to notify parent of view changes and size up or down accordingly
  useEffect(() => {
    if (onViewChange) onViewChange(view);
  }, [view, onViewChange]);

  // Effect to fetch tasks when view or currentDate changes
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);

        const grid =
          view === "month"
            ? generateMonthGrid(currentDate)
            : generateWeekGrid(currentDate);

        const start = grid[0].date;
        const end = grid[grid.length - 1].date;
        const res = await getTasksByRange(start, end);

        const grouped = groupTasksByDate(res.data, grid);
        setTasksByDate(grouped);
      } catch (err) {
        console.error("Failed to load tasks:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [view, currentDate]);

  const handleDayClick = (date) => setSelectedDate(date);

  const handleNext = () => {
    const updated = new Date(currentDate);
    if (view === "month") {
      updated.setMonth(updated.getMonth() + 1);
    } else {
      updated.setDate(updated.getDate() + 7);
    }
    setDirection(1);
    setCurrentDate(updated);
  };

  const handlePrev = () => {
    const updated = new Date(currentDate);
    if (view === "month") {
      updated.setMonth(updated.getMonth() - 1);
    } else {
      updated.setDate(updated.getDate() - 7);
    }
    setDirection(-1);
    setCurrentDate(updated);
  };

  // Animation variants based on direction
  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      position: "absolute",
    }),
    center: {
      x: 0,
      opacity: 1,
      position: "relative",
    },
    exit: (direction) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
      position: "absolute",
    }),
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
        <div className="relative min-h-[500px] overflow-hidden">
          <AnimatePresence mode="sy" custom={direction}>
            <motion.div
              tabIndex={-1}
              key={view + currentDate.toISOString()} 
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4 }}
              className="relative w-full"
            >
              {/* The CalendarGrid never removes the parent container */}
              <CalendarGrid
                currentDate={currentDate}
                view={view}
                tasksByDate={tasksByDate}
                onDayClick={handleDayClick}
              />
            </motion.div>
          </AnimatePresence>
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