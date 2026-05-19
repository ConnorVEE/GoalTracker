import { useState } from 'react';
// MUI
import { Box, Typography, IconButton } from "@mui/material"
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline"
import EditIcon from "@mui/icons-material/Edit"
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

const TaskItem = ({ task, onToggle, onEdit, onDelete, isSaving }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");

  const startEditing = (task) => {
    setIsEditing(true);
    setEditTitle(task.title);
  };

  // Handle save function goes here
  const handleSave = async () => {
    await onEdit(task, { title: editTitle });

    setIsEditing(false);
    setEditTitle("");
  };

  return (
    isEditing ? (
        <div key={task.id}>
          <input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
          />

          <button onClick={() => handleSave()}>
            Save
          </button>

          <button onClick={() => setIsEditing(false)}>
            Cancel
          </button>
        </div>
      ) : (
        <Box
        className="min-w-[280px] max-w-[350px] relative rounded-2xl 
        px-2 py-2 flex gap-3 border-[#678498] border-2 box-shadow-md" 
        sx={{ 
          backgroundColor: "transparent",
         }}
        >
          {/* Toggle Completion */}
          <IconButton
              onClick={() => onToggle?.(task)}
              sx={{
                  color: task.completed ? "#E5B842" : "#A9B4BC",
                  "&:hover": {
                      color: task.completed ? "#d4a93f" : "#7f8c99",
                  },
                  width: 25,
                  height: 25,
              }}
              disabled={isSaving}
          >
              {task.completed ? <RadioButtonCheckedIcon fontSize="small" /> : <RadioButtonUncheckedIcon fontSize="small" />}
          </IconButton>

          <div>
              <Typography sx={{ fontSize: 18, textDecoration: task.completed ? "line-through" : "none" }}>
                  {task.title}
              </Typography>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-1 absolute right-2">
            <IconButton
                onClick={() => setIsEditing(true)}
                sx={{
                    boxShadow: 2,
                    backgroundColor: "#EBBE4D",
                    color: "black",
                    "&:hover": {
                        backgroundColor: "#d4a93f",
                    },
                    width: 25,
                    height: 25,
                }}
                disabled={isSaving}
            >
                <EditIcon fontSize="small" />
            </IconButton>

            <IconButton
                onClick={() => onDelete?.(task)}
                sx={{
                    boxShadow: 2,
                    backgroundColor: "#9B0B16",
                    color: "black",
                    "&:hover": {
                        backgroundColor: "#7f0912",
                    },
                    width: 25,
                    height: 25,
                }}
                disabled={isSaving}
            >
                <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </div>    
        </Box>
      )
  );
}

export default TaskItem;