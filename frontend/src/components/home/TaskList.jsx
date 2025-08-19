import { useState } from "react";
import TaskItem from "./TaskItem";
import { motion, AnimatePresence } from "framer-motion";

const variants = {
  enter: (direction) => ({
    x: direction > 0 ? -30 : 30,
    opacity: 0
  }),
  center: {
    x: 0,
    opacity: 1
  },
  exit: (direction) => ({
    x: direction > 0 ? 30 : -30,
    opacity: 0
  })
};

const TaskList = ({ tasks, direction }) => {
  const [checkedTasks, setCheckedTasks] = useState([]);

  const toggleTaskChecked = (taskId) => {
    setCheckedTasks((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId]
    );
  };

  return (
    <AnimatePresence mode="wait" custom={direction}>
      
      <motion.div
        key={tasks.map((t) => t.id).join("-")} // changes when tasks change
        custom={direction}
        variants={variants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{ duration: 0.25 }}
        className="grid grid-cols-2 gap-4 w-full"
      >
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            isChecked={checkedTasks.includes(task.id)}
            onToggle={() => toggleTaskChecked(task.id)}
          />
        ))}
      </motion.div>

    </AnimatePresence>
  );
};

export default TaskList;