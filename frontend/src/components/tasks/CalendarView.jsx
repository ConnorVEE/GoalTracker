import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { groupTasksByDate, generateMonthGrid, generateWeekGrid } from "../../utils/calendarUtils";
import CalendarToggle from "./CalendarToggle";
import CalendarHeader from "./CalendarHeader";
import CalendarGrid from "./CalendarGrid";
import DayTaskModal from "./DayTaskModal";

export default function CalendarView({ tasks, onViewChange, onRangeChange, loadTasksByRange }) {
  const [view, setView] = useState("month");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [tasksByDate, setTasksByDate] = useState({});
  const [loading, setLoading] = useState(true);
  const [direction, setDirection] = useState(0);

  // Effect to handle view changes and notify parent component
  useEffect(() => {
    if (onViewChange) onViewChange(view);
  }, [view, onViewChange]);

  // Effect to load tasks when view or current date changes
  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);

      try {
        const grid =
          view === "month"
            ? generateMonthGrid(currentDate)
            : generateWeekGrid(currentDate);

        const start = grid[0].date;
        const end = grid[grid.length - 1].date;

        if (onRangeChange) onRangeChange({ start, end });
        if (loadTasksByRange) await loadTasksByRange(start, end);

      } catch (err) {
        console.error("CalendarView failed to fetch tasks:", err);
      } finally {
        setLoading(false); // ✅ ensure spinner stops
      }
    };

    fetchTasks();
  }, [view, currentDate]);

  // Effect to regroup when tasks change
  useEffect(() => {
    const grid =
      view === "month"
        ? generateMonthGrid(currentDate)
        : generateWeekGrid(currentDate);

    if (tasks) {
      const grouped = groupTasksByDate(tasks, grid);
      setTasksByDate(grouped);
    }
  }, [tasks, view, currentDate]);

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

      <CalendarHeader currentDate={currentDate} onNext={handleNext} onPrev={handlePrev} view={view}/>

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