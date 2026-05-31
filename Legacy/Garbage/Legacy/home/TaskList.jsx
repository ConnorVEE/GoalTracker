import { useContext, useState, useEffect } from "react";
import { TaskContext } from "../../contexts/TaskContext";
import TaskItem from "./TaskItem";
import { motion, AnimatePresence } from "framer-motion";
import CircularProgress from "@mui/material/CircularProgress";
// Util
import { getLocalDateString } from "../../utils/DateUtils.js";

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

const TaskList = ({ direction, date }) => {
  const { tasks, loading } = useContext(TaskContext);
  const [firstRender, setFirstRender] = useState(true);
  const activeDate = getLocalDateString(date);

  // Effect to mark first render
  useEffect(() => {
    setFirstRender(false);
  }, []);

  const tasksPresent = (tasks.length !== 0);

  if (loading || !tasksPresent) {
    return (
      <div className="flex justify-center py-8">
        <CircularProgress />
      </div>
    );
  }

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