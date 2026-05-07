import { useState } from "react";

const TaskListPanel = ({ date, tasks, onToggle, onCreate, onEdit, onDelete }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleToggle = async (task) => {
    setError(null);
    setIsSaving(true);

    try {
      await onToggle(task, !task.completed);
    } catch (err) {
      setError("Failed to update task.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreate = async () => {
    setError(null);

    if (!newTitle.trim()) {
      setError("Task title cannot be empty.");
      return;
    }

    setIsSaving(true);
    
    try {
      await onCreate(newTitle);
      setNewTitle("");
      setIsCreating(false);

    } catch (err) {
      console.error("Failed to create task:", err);
      setError("Failed to create task. Please try again.");
      return;

    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = async (task) => {
    setError(null);

    if (!editTitle.trim()) {
      setError("Task title cannot be empty.");
      return;
    }
    setIsSaving(true);

    try {
      await onEdit(task, { title: editTitle });
      setEditingId(null); 

    } catch (err) {
      console.error("Failed to edit task:", err);
      setError("Failed to edit task. Please try again.");
      return;

    } finally {
      setIsSaving(false);
    }
    
  };

  const handleDelete = async (task) => {
    setError(null);
    setIsSaving(true);
    
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    try {
      await onDelete(task);

    } catch (err) {
      console.error("Failed to delete task:", err);
      setError("Failed to delete task. Please try again.");
      return;

    } finally {
      setIsSaving(false);
    }
  }

  const startEditing = (task) => {
    setEditingId(task.id);
    setEditTitle(task.title);
  };

  // RETURNS
  if (!date) return <p>Select a day</p>;

  return (
    <div>
      <h3>Tasks for {date}</h3>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {tasks.map(task => ( editingId === task.id ? (

        <div key={task.id}>
          <input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
          />

          <button onClick={() => handleEdit(task)} disabled={isSaving}>
            Save
          </button>
          <button onClick={() => setEditingId(null)} disabled={isSaving}>
            Cancel
          </button>

        </div>

      ) : (
        <div key={task.id}>
          <button onClick={() => handleToggle(task)} disabled={isSaving}>
            {task.completed ? "✅" : "⬜"} {task.title}
          </button>

          <button onClick={() => startEditing(task)} disabled={isSaving}>
            Edit
          </button>
          <button onClick={() => handleDelete(task)} disabled={isSaving}>
            Delete
          </button>

        </div>
      )
      ))}

      {isCreating ? (
        <div>
            <input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="New task..."
            />

            <button onClick={handleCreate} disabled={isSaving}>
              Add
            </button>
            <button onClick={() => setIsCreating(false)} disabled={isSaving}>
              Cancel
            </button>

        </div>
        ) : (
        <button onClick={() => setIsCreating(true)} disabled={isSaving}>
            + Add Task
        </button>
      )}
    </div>
  );
};

export default TaskListPanel;