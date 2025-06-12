// src/pages/Tasks.js
import React, { useState, useEffect } from "react";
import { createTask, getTasks, updateTask, deleteTask } from "../api/taskRoutes";
import TaskForm from "../components/tasks/taskForm";
import TaskList from "../components/tasks/taskList";

const Tasks = () => {
  const [tasks, setTasks] = useState([]); // holds all tasks

  // Load all tasks
  const loadTasks = async () => {
    try {
      const res = await getTasks();
      setTasks(res.data);
    } catch (err) {
      console.error("Failed to load tasks:", err);
    }
  };

  // Create Task
  const handleCreate = async (taskData) => {
    try {
      await createTask(taskData);
      alert("Task created!");
      loadTasks();
    } catch (err) {
      console.error("Create failed:", err);
    }
    
  };

  // Update Task
  const handleUpdate = async (id, updatedData) => {
    try {
      await updateTask(id, updatedData);
      loadTasks();
    } catch (err) {
      console.error("Failed to update task:", err);
    }
  };

  // Delete Task
  const handleDelete = async (taskId) => {
    try {
      await deleteTask(taskId);
      alert("Task deleted!");
      loadTasks();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Create tasks</h2>
      <TaskForm onSave={handleCreate} />

      <h3>Your Tasks</h3>
      <TaskList
        tasks={tasks}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default Tasks;