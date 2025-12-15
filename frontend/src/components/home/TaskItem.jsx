import { useContext, useState } from "react";
import { TaskContext } from "../../contexts/TaskContext";
import Checkbox from "@mui/material/Checkbox";
import { Pencil, Trash2, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const TaskItem = ({ task }) => {
  const { toggleTaskCompletion, removeTask, editTask } = useContext(TaskContext);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);

  const handleClick = (e) => {
    if (isEditing || e.target.closest("button") || e.target.type === "checkbox") return;
    toggleTaskCompletion(task, !task.completed);
  };

  const handleSave = async () => {
    if (!editedTitle.trim() || editedTitle === task.title) {
      setIsEditing(false);
      return;
    }

    await editTask(task.id, { title: editedTitle });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTitle(task.title);
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSave();
    else if (e.key === "Escape") handleCancel();
  };

  return (
    <motion.div
      layout
      onClick={handleClick}
      className={`group cursor-pointer border rounded-lg px-4 py-3 text-lg shadow-sm transition-all hover:scale-[1.02] flex items-center gap-3 select-none ${
        task.completed
          ? "bg-gray-300 border-green-500 text-gray-500"
          : "bg-[#F3E8FF] border-[#D6B8ED] text-gray-800"
      }`}
    >
      <Checkbox
        checked={task.completed}
        onChange={() => toggleTaskCompletion(task, !task.completed)}
        onClick={(e) => e.stopPropagation()}
        sx={{
          color: "#A78BFA",
          "&.Mui-checked": { color: "#4CAF50" },
          "& .MuiSvgIcon-root": { transform: "scale(1.3)" },
          transition: "all 0.4s ease-in-out",
        }}
      />

      {/* Title / Edit Field */}
      <div className="flex-1 min-w-0">
        <AnimatePresence mode="wait" initial={false}>
          {!isEditing ? (
            <motion.span
              key="title"
              initial={{ opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -3 }}
              transition={{ duration: 0.15 }}
              className="font-medium break-words [overflow-wrap:anywhere]"
            >
              {task.title}
            </motion.span>
          ) : (
            <motion.input
              key="input"
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              className="w-full bg-white border border-purple-300 rounded px-2 py-1 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          )}
        </AnimatePresence>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        {!isEditing ? (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
              className="p-1 rounded hover:bg-yellow-100"
            >
              <Pencil size={18} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                removeTask(task.id);
              }}
              className="p-1 rounded hover:bg-red-100"
            >
              <Trash2 size={18} />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSave();
              }}
              className="p-1 rounded hover:bg-green-100"
            >
              <Check size={18} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCancel();
              }}
              className="p-1 rounded hover:bg-red-100"
            >
              <X size={18} />
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default TaskItem;

  // return (
  //   <div
  //     onClick={handleClick}
  //     className={`cursor-pointer border rounded-lg px-4 py-3 text-lg shadow-sm transition-all hover:scale-[1.02] flex items-center gap-3 select-none ${
  //       isChecked
  //         ? "bg-gray-400 border-green-500 text-gray-500"
  //         : "bg-[#F3E8FF] border-[#D6B8ED] text-gray-800"
  //     }`}
  //   >

  //     <Checkbox
  //       checked={isChecked}
  //       onChange={onToggle}
  //       onClick={(e) => e.stopPropagation()}
  //       sx={{
  //         color: "#A78BFA",
  //         "&.Mui-checked": { color: "#4CAF50" },
  //         "& .MuiSvgIcon-root": { transform: "scale(1.3)" },
  //         transition: "all 0.4s ease-in-out",
  //       }}
  //     />

  //     <span className="font-medium transition-colors flex-1 min-w-0 break-words [overflow-wrap:anywhere]">
  //       {task.title}
  //     </span>

  //   </div>
  // );