import { useState } from 'react';

const TaskItem = ({ task, onToggle, onEdit, onDelete, isSaving }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");

  const startEditing = (task) => {
    setIsEditing(true);
    setEditTitle(task.title);
  };

  // Handle save function goes here
  const handleSave = async () => {
    await onEdit(task, { title: editTitle });

    setIsEditing(false);
    setEditTitle("");
  };

  return (
    isEditing ? (
        <div key={task.id}>
          <input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
          />

          <button onClick={() => handleSave()}>
            Save
          </button>

          <button onClick={() => setEditingId(null)}>
            Cancel
          </button>
        </div>
      ) : (
        <div key={task.id}>
          <button onClick={() => onToggle(task)} disabled={isSaving}>
            {task.completed ? "✓" : "○"} {task.title}
          </button>

          <button onClick={() => startEditing(task)} disabled={isSaving}>
            Edit
          </button>
          <button onClick={() => onDelete(task)} disabled={isSaving}>
            Delete
          </button>
        </div>
      )
  );
}

export default TaskItem;