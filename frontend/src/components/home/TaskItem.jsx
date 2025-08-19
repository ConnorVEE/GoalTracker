import Checkbox from "@mui/material/Checkbox";

const TaskItem = ({ task, isChecked, onToggle }) => {
  const handleClick = (e) => {
    if (e.target.type !== "checkbox") onToggle();
  };

  return (
    <div
      onClick={handleClick}
      className={`cursor-pointer border rounded-lg px-4 py-3 text-lg shadow-sm transition-all hover:scale-[1.02] flex items-center gap-3 select-none ${
        isChecked
          ? "bg-gray-400 border-green-500 text-gray-500"
          : "bg-[#F3E8FF] border-[#D6B8ED] text-gray-800"
      }`}
    >

      <Checkbox
        checked={isChecked}
        onChange={onToggle}
        onClick={(e) => e.stopPropagation()}
        sx={{
          color: "#A78BFA",
          "&.Mui-checked": { color: "#4CAF50" },
          "& .MuiSvgIcon-root": { transform: "scale(1.3)" },
          transition: "all 0.4s ease-in-out",
        }}
      />

      {/* text container must be allowed to shrink */}
      <span className="font-medium transition-colors flex-1 min-w-0 break-words [overflow-wrap:anywhere]">
        {task.title}
      </span>

    </div>
  );
};

export default TaskItem;