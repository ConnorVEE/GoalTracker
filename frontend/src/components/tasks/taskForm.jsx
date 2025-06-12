import React, { useState } from "react";

const TaskForm = ({ onSave }) => { 
    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    
    const handleSubmit = (e) => {
        e.preventDefault();

        const normalizedDate = new Date(date).toISOString().split("T")[0];
    
        onSave({
        title,
        date: normalizedDate,
        });
    };
    
    return (
        <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
            <div>
                <label>Title:</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
        
            <div>
                <label>Date:</label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>

            <button type="submit">Create</button>
        </form>
    );
}

export default TaskForm;