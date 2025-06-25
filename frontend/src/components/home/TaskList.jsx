import TaskItem from "./TaskItem";

const TaskList = ({ tasks }) => {
  return (
    <div className="grid grid-cols-2 gap-4 w-full">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  );
};

export default TaskList;