// src/pages/Goals.js
import React, { useState } from "react";
import { createGoal } from "../api/goals";

const Goals = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await createGoal({
        title,
        description,
        due_date: dueDate,
      });
      console.log("Goal created:", response.data);
      alert("Goal created successfully!");
    } catch (error) {
      console.error("Error creating goal:", error.response?.data || error.message);
      alert("Something went wrong.");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Create a Goal</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <label>Description:</label>
          <input value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div>
          <label>Due Date:</label>
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        </div>
        <button type="submit">Create Goal</button>
      </form>
    </div>
  );
};

export default Goals;