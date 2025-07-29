import { format } from "date-fns";

export default function DayTaskModal({ date, tasks, onClose }) {
  if (!date) return null; // Don’t render if no day selected

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">

      <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>

        {/* Header */}
        <h2 className="text-xl font-semibold text-purple-700 mb-4">
          Tasks for {format(date, "EEEE, MMMM d, yyyy")}
        </h2>

        {/* Task list */}
        {tasks.length > 0 ? (
          <ul className="space-y-3">
            {tasks.map((task) => (
              <li
                key={task.id}
                className="p-3 border rounded-md bg-gray-50 hover:bg-purple-50 transition"
              >
                <div className="font-medium text-gray-800">{task.title}</div>
                
                {task.goal && (
                  <div className="text-sm text-gray-600">
                    Goal: {task.goal.title}
                  </div>
                )}

                {task.recurrence_days?.length > 0 && (
                  <div className="text-xs text-purple-600 mt-1">
                    Recurs on: {task.recurrence_days.join(", ")}
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No tasks for this day.</p>
        )}
      </div>

    </div>
  );
}