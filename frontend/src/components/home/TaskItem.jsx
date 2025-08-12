import Checkbox from "@mui/material/Checkbox";

const TaskItem = ({ task, isChecked, onToggle }) => {
  return (
    <div
      className={`border rounded-lg px-4 py-3 text-lg shadow-sm transition-all hover:scale-[1.02] flex items-center gap-3 ${
        isChecked
          ? "bg-gray-400 border-gray-400 text-gray-500"
          : "bg-[#F3E8FF] border-[#D6B8ED] text-gray-800"
      }`}
    >

      <Checkbox
        checked={isChecked}
        onChange={onToggle}
        sx={{
          color: "#A78BFA",
          "&.Mui-checked": {
            color: "#A78BFA",
          },
          "& .MuiSvgIcon-root": {
            transform: "scale(1.3)"
          },
          transition: "all 0.4s ease-in-out",
        }}
      />

      <span
        className={`font-medium transition-colors ${
          isChecked ? "line-through" : ""
        }`}
      >
        {task.title}
      </span>

    </div>
  );
};

export default TaskItem;