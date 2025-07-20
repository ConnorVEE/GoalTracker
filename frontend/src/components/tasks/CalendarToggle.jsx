export default function CalendarToggle({ view, setView }) {
  const buttons = [
    { label: "Week", value: "week" },
    { label: "Month", value: "month" },
  ];

  return (
    <div className="inline-flex rounded-md shadow-sm overflow-hidden border border-gray-300">
      {buttons.map((btn) => (
        <button
          key={btn.value}
          onClick={() => setView(btn.value)}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            view === btn.value
              ? "bg-purple-600 text-white"
              : "bg-white text-gray-700 hover:bg-purple-100"
          }`}
        >
          {btn.label}
        </button>
      ))}
    </div>
  );
}