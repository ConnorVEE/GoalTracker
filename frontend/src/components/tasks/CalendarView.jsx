import { useState } from "react";
import { generateMonthGrid } from "../../utils/calendarUtils";
import CalendarToggle from "./CalendarToggle.jsx";
import CalendarHeader from "./CalendarHeader";
// import CalendarGrid from "./CalendarGrid";

export default function CalendarView({ tasks }) {
  const [view, setView] = useState("month"); // or 'week'
  const [currentDate, setCurrentDate] = useState(new Date());

  const handleNext = () => {
    const updated = new Date(currentDate);
    if (view === "month") {
      updated.setMonth(updated.getMonth() + 1);
    } else {
      updated.setDate(updated.getDate() + 7);
    }
    setCurrentDate(updated);
  };

  const handlePrev = () => {
    const updated = new Date(currentDate);
    if (view === "month") {
      updated.setMonth(updated.getMonth() - 1);
    } else {
      updated.setDate(updated.getDate() - 7);
    }
    setCurrentDate(updated);
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
      {/* <CalendarGrid
        currentDate={currentDate}
        view={view}
        tasks={tasks}
      /> */}
    </div>
  );
}