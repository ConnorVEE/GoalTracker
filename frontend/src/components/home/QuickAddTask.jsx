// QuickAddTask.jsx
import { useState } from "react";

const QuickAddTask = ({ onSave }) => {
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");

  const handleSubmit = () => {
    if (!taskTitle.trim()) return;
    onSave(taskTitle);
    setTaskTitle("");
    setShowQuickAdd(false);
  };

  const handleCancel = () => {
    setShowQuickAdd(false);
    setTaskTitle("");
  };

  return (
    <div className="w-full max-w-3xl mt-6 mb-4">
      {!showQuickAdd ? (
        <div className="flex justify-end">
          <button
            onClick={() => setShowQuickAdd(true)}
            className="bg-[#6A4C93] text-white text-sm px-4 py-2 rounded-lg hover:bg-[#4b3670]"
          >
            + Add Task
          </button>
        </div>
      ) : (
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Task title..."
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none w-full"
          />

          <button
            onClick={handleSubmit}
            className="bg-[#6A4C93] text-white px-3 py-2 rounded-lg hover:bg-[#4b3670]"
          >
            Save
          </button>

          <button
            onClick={handleCancel}
            className="text-sm text-gray-600 hover:underline"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default QuickAddTask;