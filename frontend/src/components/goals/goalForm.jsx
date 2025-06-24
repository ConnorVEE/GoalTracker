import { useState } from "react";
import { TextField, Button } from "@mui/material";

const GoalForm = ({ onSave }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      title,
      description,
      due_date: dueDate,
    });

    setTitle("");
    setDescription("");
    setDueDate("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-md p-6 mb-6 max-w-xl mx-auto"
    >
      <h2 className="text-xl font-semibold text-center text-purple-700 mb-4">
        Create a New Goal
      </h2>

      <div className="space-y-4">
        <TextField
          fullWidth
          label="Title"
          variant="outlined"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ backgroundColor: "#F3E8FF", borderRadius: "8px" }}
        />

        <TextField
          fullWidth
          label="Description"
          variant="outlined"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          sx={{ backgroundColor: "#F3E8FF", borderRadius: "8px" }}
        />

        <TextField
          fullWidth
          type="date"
          label="Due Date"
          variant="outlined"
          InputLabelProps={{ shrink: true }}
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          sx={{ backgroundColor: "#F3E8FF", borderRadius: "8px" }}
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{
            backgroundColor: "#A78BFA",
            "&:hover": { backgroundColor: "#8B5CF6" },
            color: "white",
            padding: "10px",
            borderRadius: "8px",
            fontWeight: "bold",
          }}
        >
          Save Goal
        </Button>
      </div>
    </form>
  );
};

export default GoalForm;