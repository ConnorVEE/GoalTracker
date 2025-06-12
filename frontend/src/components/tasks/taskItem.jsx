import react, { useState } from 'react';

const TaskItem = ({ task, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title || "");
  const [date, setDate] = useState(task.date || "");

  const handleSave = () => {
    const normalizedDate = new Date(date).toISOString().split("T")[0];

    onUpdate(task.id, { title, date: normalizedDate });
    setIsEditing(false);
  };

  return (
    <li>
      {isEditing ? (
        <>
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <button onClick={handleSave}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </>
      ) : (
        <>
          <strong>{task.title}</strong> — {task.due_date}
          <button onClick={() => setIsEditing(true)}>Edit</button>
          <button onClick={() => onDelete(task.id)}>Delete</button>
        </>
      )}
    </li>
  );
}

export default TaskItem;