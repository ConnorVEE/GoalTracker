import { useState } from "react";
import TaskItem from "./TaskItem";

const TaskList = ({ tasks }) => {
  const [checkedTasks, setCheckedTasks] = useState([]);

  const toggleTaskChecked = (taskId) => {
    setCheckedTasks((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId]
    );
  };

  return (
    <div className="grid grid-cols-2 gap-4 w-full">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          isChecked={checkedTasks.includes(task.id)}
          onToggle={() => toggleTaskChecked(task.id)}
        />
      ))}
    </div>
  );
};

export default TaskList;