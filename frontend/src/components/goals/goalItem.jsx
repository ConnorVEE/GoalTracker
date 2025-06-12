import React, { useState } from "react";
import { TextField, Button, Card, CardContent, Typography } from "@mui/material";

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
    <Card
      className="bg-white rounded-2xl shadow-md mb-4"
      sx={{
        backgroundColor: "#FDF9FF",
        border: "1px solid #E9D8FD",
        padding: 1,
      }}
    >
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            <TextField
              fullWidth
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              sx={{ backgroundColor: "#F3E8FF", borderRadius: "8px" }}
            />
            <TextField
              fullWidth
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              sx={{ backgroundColor: "#F3E8FF", borderRadius: "8px" }}
            />
            <TextField
              fullWidth
              type="date"
              label="Due Date"
              InputLabelProps={{ shrink: true }}
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              sx={{ backgroundColor: "#F3E8FF", borderRadius: "8px" }}
            />

            <div className="flex justify-end gap-2">
              <Button
                variant="contained"
                onClick={handleSave}
                sx={{
                  backgroundColor: "#A78BFA",
                  "&:hover": { backgroundColor: "#8B5CF6" },
                  fontWeight: "bold",
                  borderRadius: "8px",
                }}
              >
                Save
              </Button>

              <Button
                variant="outlined"
                onClick={() => setIsEditing(false)}
                sx={{
                  color: "#6B21A8",
                  borderColor: "#D8B4FE",
                  fontWeight: "bold",
                  borderRadius: "8px",
                }}
              >
                Cancel
              </Button>
            </div>
            
          </div>
        ) : (
          <>
            <Typography variant="h6" sx={{ color: "#6B21A8" }}>
              {goal.title}
            </Typography>
            <Typography variant="body2" className="mb-2 text-gray-700">
              {goal.description || "No description"}
            </Typography>
            <Typography variant="caption" className="text-sm text-gray-500 mb-4 block">
              Due: {goal.due_date}
            </Typography>

            <div className="flex justify-end gap-2">
              <Button
                variant="outlined"
                onClick={() => setIsEditing(true)}
                sx={{
                  color: "#6B21A8",
                  borderColor: "#D8B4FE",
                  fontWeight: "bold",
                  borderRadius: "8px",
                }}
              >
                Edit
              </Button>

              <Button
                variant="outlined"
                color="error"
                onClick={() => onDelete(goal.id)}
                sx={{ borderRadius: "8px" }}
              >
                Delete
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default GoalItem;