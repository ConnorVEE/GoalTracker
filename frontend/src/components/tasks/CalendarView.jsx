import { useState } from "react";
import { groupTasksByDate } from "../../utils/calendarUtils";
import CalendarToggle from "./CalendarToggle";
import CalendarHeader from "./CalendarHeader";
import CalendarGrid from "./CalendarGrid";

export default function CalendarView({ tasks }) {
  const [view, setView] = useState("month"); // or 'week'
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const tasksByDate = groupTasksByDate(tasks || []);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleDayClick = (date) => {
    setSelectedDate(date);
    console.log("Selected date:", date);
  };

  const handleNext = () => {
    const updated = new Date(currentDate);
    if (view === "month") {
      updated.setMonth(updated.getMonth() + 1);
    } else {
      updated.setDate(updated.getDate() + 7);
    }

    setIsAnimating(true); // Start fade-out

    setTimeout(() => {
      setCurrentDate(updated);  // Switch month/week
      setIsAnimating(false);    // Fade back in
    }, 500); // Duration matches transition-opacity

  };

  const handlePrev = () => {
    const updated = new Date(currentDate);
    if (view === "month") {
      updated.setMonth(updated.getMonth() - 1);
    } else {
      updated.setDate(updated.getDate() - 7);
    }

    setIsAnimating(true); // Start fade-out

    setTimeout(() => {
      setCurrentDate(updated);  // Switch month/week
      setIsAnimating(false);    // Fade back in
    }, 500); // Duration matches transition-opacity

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

    </div>
  );
}