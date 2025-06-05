// src/pages/Tasks.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTask } from "../api/tasks";

const Tasks = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        title,
        description,
        date,
      };

      // Only include `time` if it's not an empty string
      payload.time = time.trim() === "" ? null : time;

      const response = await createTask(payload);
      console.log("Task created:", response.data);
      alert("Task created!");
    } catch (error) {
      console.error("Task error:", error.response?.data || error.message);
      alert("Task creation failed.");
    }
  };


  const goHome = () => {
    navigate("/home");
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Welcome to the tasks page!</h2>
      <button onClick={goHome}>Go home</button>

      <hr style={{ margin: "2rem 0" }} />

      <form onSubmit={handleSubmit} style={{ maxWidth: "400px", margin: "auto" }}>
        <h3>Create a Task</h3>

        <div>
          <label>Title:</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        <div>
          <label>Description:</label>
          <input value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>

        <div>
          <label>Date:</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>

        <div>
          <label>Time:</label>
          <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
        </div>

        <button type="submit">Create Task</button>
      </form>
    </div>
  );
};

export default Tasks;