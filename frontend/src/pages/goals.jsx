import React, { useState, useEffect } from "react";
import { getGoals, createGoal, updateGoal, deleteGoal } from "../api/goalRoutes";
import GoalForm from "../components/goals/goalForm";
import GoalList from "../components/goals/goalList";

const Goals = () => {
  const [goals, setGoals] = useState([]); // holds all goals

  // Load all goals
  const loadGoals = async () => {
    try {
      const res = await getGoals();
      setGoals(res.data);
    } catch (err) {
      console.error("Failed to load goals:", err);
    }
  };

  // Create Goal
  const handleSave = async (goalData) => {
    try {
      await createGoal(goalData);
      alert("Goal created!");
      loadGoals();

    } catch (err) {
      console.error("Create failed:", err);
    }
  };

  // Update Goal
  const handleUpdate = async (id, updatedData) => {
    try {
      await updateGoal(id, updatedData);
      loadGoals();
    } catch (err) {
      console.error("Failed to update goal:", err);
    }
  };

  // Delete Goal
  const handleDelete = async (goalId) => {
    try {
      await deleteGoal(goalId);
      alert("Goal deleted!");
      loadGoals();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  useEffect(() => {
    loadGoals();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Create goal</h2>
      <GoalForm onSave={handleSave} />

      <h3>Your Goals</h3>
      <GoalList
        goals={goals}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default Goals;