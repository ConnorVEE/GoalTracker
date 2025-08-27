import { format, isToday } from "date-fns";

export default function CalendarDay({ date, tasks, onClick, isCurrentMonth }) {
  const dayNum = format(date, "d"); // just the number, e.g. "12"
  const count = tasks.length;
  const dotsToRender = Math.min(count, 3);
  const extraCount = count > 3 ? count - 3 : 0;

  return (
    <button
      onClick={onClick}
      type="button"
      tabIndex={-1}
      className={`
        p-2 rounded-md w-full h-20 flex flex-col items-start justify-start
        text-left border hover:bg-purple-100 transition
        ${!isCurrentMonth ? "text-gray-400 bg-gray-300" : "text-gray-500"}
        ${isToday(date) ? "border-purple-500 border-2" : "border-gray-200"}
      `}
    >
      <span className="text-sm font-semibold">{dayNum}</span>

      {/* Task indicators (bottom-left corner) */}
      <div className="mt-auto flex items-center space-x-1">

        {Array.from({ length: dotsToRender }).map((_, i) => (
          <span
            key={i}
            className="w-2 h-2 bg-gray-500 rounded-full"
          />
        ))}

        {extraCount > 0 && (
          <span className="text-xs text-gray-500">+{extraCount}</span>
        )}
        
      </div>
    </button>
  );
}

// import { format, isToday } from "date-fns";

// export default function CalendarDay({ date, tasks, onClick, isCurrentMonth }) {
//   const dayNum = format(date, "d"); // just the number, e.g. "12"

//   return (
//     <button
//       onClick={onClick}
//       type="button"
//       tabIndex={-1}
//       className={`
//         p-2 rounded-md w-full h-20 flex flex-col items-start justify-start
//         text-left border hover:bg-purple-100 transition
//         ${!isCurrentMonth ? "text-gray-400 bg-gray-300" : "text-gray-500"}
//         ${isToday(date) ? "border-purple-500 border-2" : "border-gray-200"}
//       `}
//     >
//       <span className="text-sm font-semibold">{dayNum}</span>
//       {/* Placeholder for future task indicators */}
//     </button>
//   );
// }