import { useState, useEffect, useRef } from "react";
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
  const gridRef = useRef(null);
  const [gridHeight, setGridHeight] = useState(0);
  const [firstRender, setFirstRender] = useState(true);

  // Effect to mark first render
  useEffect(() => {
    setFirstRender(false);
  }, []);

  // Effect to handle grid height changes
  useEffect(() => {
    if (!gridRef.current) return;

    // Initialize height
    setGridHeight(gridRef.current.getBoundingClientRect().height);

    // Resize observer to watch the grid
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setGridHeight(entry.contentRect.height);
      }
    });

    observer.observe(gridRef.current);

    return () => observer.disconnect();
  }, [view, tasksByDate]);

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

      <div className="overflow-hidden">

          <CalendarToggle view={view} setView={setView} />
          <CalendarHeader currentDate={currentDate} onNext={handleNext} onPrev={handlePrev} view={view} />

          {/* Animate the grid sliding left/right, but parent stays in DOM */}
          <div className="relative w-full overflow-hidden">

            <motion.div
              animate={{ height: gridHeight }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              style={{ overflow: "hidden" }}
            >
              <div ref={gridRef}>

                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={view + currentDate.toISOString()}
                    custom={direction}
                    initial={firstRender ? false : { x: direction > 0 ? 300 : -300, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: direction > 0 ? -300 : 300, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{ width: "100%" }}
                  >
                    <CalendarGrid
                      currentDate={currentDate}
                      view={view}
                      tasksByDate={tasksByDate}
                      onDayClick={setSelectedDate}
                    />
                  </motion.div>
                </AnimatePresence>

              </div>

            </motion.div>

          </div>

      </div>

      <DayTaskModal date={selectedDate}
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