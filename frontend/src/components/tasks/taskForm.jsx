import React, { useState } from "react";

const TaskForm = ({ onSave }) => { 
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    
    const handleSubmit = (e) => {
        e.preventDefault();

        const normalizedDate = new Date(date).toISOString().split("T")[0];
    
        onSave({
        title,
        description,
        date: normalizedDate,
        time: time.trim() === "" ? null : time,
        });
    };
    
    return (
        <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
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
    
        <button type="submit">Create</button>
        </form>
    );
}

export default TaskForm;