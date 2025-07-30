import { format, startOfWeek, endOfWeek } from "date-fns";

export default function CalendarHeader({ currentDate, view, onPrev, onNext }) {

  // Generate display label based on view mode
  const getLabel = () => {
    if (view === "month") {
      return format(currentDate, "MMMM yyyy"); // e.g., "July 2025"
      
    } else {
      const start = startOfWeek(currentDate, { weekStartsOn: 0 });
      const end = endOfWeek(currentDate, { weekStartsOn: 0 });

      const sameMonth = start.getMonth() === end.getMonth();

      // Modify to maybe not show both dates in the same month? Not sure yet
      return `${format(start, "MMM d")} ${` – ${format(end, "MMM d")}`}, ${format(end, "yyyy")}`;

    }
  };

  return (
    <div className="flex items-center justify-center gap-4 mb-4">
      <button
        onClick={onPrev}
        tabIndex={-1}
        type="button"
        className="text-purple-600 hover:text-purple-800 font-medium"
      >
        ←
      </button>

      <h2 className="text-xl font-semibold text-gray-800 min-w-[155px] text-center">
        {getLabel()}
      </h2>

      <button
        onClick={onNext}
        tabIndex={-1}
        type="button"
        className="text-purple-600 hover:text-purple-800 font-medium"
      >
        →
      </button>
    </div>

  );
}