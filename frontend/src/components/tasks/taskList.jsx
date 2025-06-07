import react from 'react';
import TaskItem from './taskItem';

const TaskList = ({ tasks, onUpdate, onDelete }) => {
  return (
    <ul>
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}

export default TaskList;