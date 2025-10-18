import { useContext, useState, useEffect } from "react";
import { TaskContext } from "../../contexts/TaskContext";
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

const TaskList = ({ direction }) => {
  const { tasks } = useContext(TaskContext);
  const [firstRender, setFirstRender] = useState(true);

  // Effect to mark first render
  useEffect(() => {
    setFirstRender(false);
  }, []);

  return (
    <AnimatePresence mode="wait" custom={direction}>
      
      <motion.div
        key={`tasklist-${direction}`}
        custom={direction}
        variants={variants}
        initial={firstRender ? false : "enter"}
        animate="center"
        exit="exit"
        transition={{ duration: 0.25 }}
        className="grid grid-cols-2 gap-4 w-full"
      >
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
          />
        ))}
      </motion.div>

    </AnimatePresence>
  );
};

export default TaskList;