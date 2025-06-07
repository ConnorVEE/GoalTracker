import React, { useState } from "react";

const GoalItem = ({ goal, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(goal.title);
  const [description, setDescription] = useState(goal.description);
  const [dueDate, setDueDate] = useState(goal.due_date);

  const handleSave = () => {
    onUpdate(goal.id, { title, description, due_date: dueDate });
    setIsEditing(false);
  };

  return (
    <li>
      {isEditing ? (
        <>
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
          <input value={description} onChange={(e) => setDescription(e.target.value)} />
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
          <button onClick={handleSave}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </>
      ) : (
        <>
          <strong>{goal.title}</strong> — {goal.due_date}
          <p>{goal.description}</p>
          <button onClick={() => setIsEditing(true)}>Edit</button>
          <button onClick={() => onDelete(goal.id)}>Delete</button>
        </>
      )}
    </li>
  );
};

export default GoalItem;