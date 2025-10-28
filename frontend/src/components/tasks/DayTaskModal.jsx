// DayTaskModal.jsx (Updated with ModalTaskItem logic)

import { format } from "date-fns";
import { useTasks } from "../../contexts/useTasks";
// Import necessary UI components/icons
import Checkbox from "@mui/material/Checkbox";
import { Pencil, Trash2, Check, X } from "lucide-react";
import { useState, useContext } from "react"; // Need useContext for the TaskContext in the sub-component
import { motion, AnimatePresence } from "framer-motion"; // Keep for consistency if needed

// --- ModalTaskItem Component (Defined within the same file for encapsulation) ---
const ModalTaskItem = ({ task, onClose }) => {
  // Use the context directly inside the sub-component
  const { toggleTaskCompletion, removeTask, editTask } = useTasks(); 
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);

  // Simplified click handler (no motion layout needed here)
  const handleClick = (e) => {
    if (isEditing || e.target.closest("button") || e.target.type === "checkbox") return;
    toggleTaskCompletion(task.id, !task.completed);
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
  
  const handleDelete = async (e) => {
    e.stopPropagation();
    await removeTask(task.id);
    
    // Optional: If the last task is deleted, consider closing the modal.
    // However, the modal should stay open until CalendarView updates and 
    // passes an empty task list, which should happen automatically.
  };

  return (
    <motion.li
      onClick={handleClick}
      className={`group cursor-pointer border rounded-lg px-3 py-2 text-md shadow-sm transition-all flex flex-col gap-1 select-none ${
        task.completed
          ? "bg-gray-300 border-green-500 text-gray-500"
          : "bg-[#F3E8FF] border-[#D6B8ED] text-gray-800 hover:bg-purple-100"
      }`}
    >
      <div className="flex items-start justify-between gap-3 w-full">
        {/* Checkbox */}
        <div className="pt-0.5">
          <Checkbox
            checked={task.completed}
            onChange={() => toggleTaskCompletion(task.id, !task.completed)}
            onClick={(e) => e.stopPropagation()}
            sx={{
              padding: 0,
              color: "#A78BFA",
              "&.Mui-checked": { color: "#4CAF50" },
              "& .MuiSvgIcon-root": { transform: "scale(1.1)" },
              transition: "all 0.4s ease-in-out",
            }}
          />
        </div>

        {/* Title / Edit Field */}
        <div className="flex-1 min-w-0 pr-2 pt-0.5">
          <AnimatePresence mode="wait" initial={false}>
            {!isEditing ? (
              <motion.span
                key="title"
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -3 }}
                transition={{ duration: 0.15 }}
                className={`font-medium break-words [overflow-wrap:anywhere] ${task.completed ? 'line-through' : ''}`}
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
                onClick={(e) => e.stopPropagation()} // Stop propagation on input
                className="w-full bg-white border border-purple-300 rounded px-2 py-1 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            )}
          </AnimatePresence>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {!isEditing ? (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
                className="p-1 rounded hover:bg-yellow-100"
              >
                <Pencil size={16} />
              </button>
              <button
                onClick={handleDelete}
                className="p-1 rounded hover:bg-red-100"
              >
                <Trash2 size={16} />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); handleSave(); }}
                className="p-1 rounded hover:bg-green-100"
              >
                <Check size={16} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleCancel(); }}
                className="p-1 rounded hover:bg-red-100"
              >
                <X size={16} />
              </button>
            </>
          )}
        </div>
      </div>
      
      {/* Secondary Info (Goal and Recurrence) */}
      {(task.goal || task.recurrence_rule) && (
          <div className="ml-7 text-xs flex gap-3">
              {task.goal && (
                  <span className="text-gray-600">
                      Goal: {task.goal.title}
                  </span>
              )}
              {task.recurrence_rule && (
                  <span className="text-purple-600">
                      Recurring
                  </span>
              )}
          </div>
      )}
    </motion.li>
  );
};

// DayTaskModal Main Component
export default function DayTaskModal({ date, tasks, onClose }) {
  const { error } = useTasks();

  if (!date) return null;

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
          <ul className="space-y-3 max-h-96 overflow-y-auto">
            {tasks.map((task) => (
              <ModalTaskItem
                key={task.id}
                task={task}
                onClose={onClose} // Pass down the modal close function for post-delete action
              />
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No tasks for this day.</p>
        )}
      </div>

    </div>
  );
}