import { useState } from 'react';
// MUI
import { Box, Typography, IconButton, TextField } from "@mui/material"
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline"
import EditIcon from "@mui/icons-material/Edit"
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';

const TaskItem = ({ task, onToggle, onEdit, onDelete, isSaving, error }) => {
  const [touched, setTouched] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [titleDraft, setTitleDraft] = useState(task.title || "");
  const titleError = titleDraft.trim() === "";

  const startEditing = (task) => {
    setIsEditing(true);
    setTitleDraft(task.title);
  };

  const formErrors = {
    title: (error?.field === "title" && error.message) || (titleError ? "Title cannot be empty" : ""),
    server: error?.type === "server" ? error.message : ""
  };

  // Handle save function goes here
  const handleSave = async () => {
    if (titleError || isSaving) return;

    await onEdit(task, { title: titleDraft });

    setIsEditing(false);
    setTitleDraft("");
  };

  return (
    isEditing ? (
        <Box
        className="min-w-[280px] max-w-[350px] relative rounded-2xl 
        px-2 py-2 flex gap-3 border-[#678498] border-2 box-shadow-md" 
        sx={{ 
          backgroundColor: "transparent",
         }}
        >

          <TextField
            variant="standard"
            multiline
            maxRows={3}
            size="small"
            hiddenLabel
            fullWidth
            value={titleDraft}
            onChange={(e) => !isSaving && setTitleDraft(e.target.value)}
            onBlur={() => setTouched(true)}
            placeholder="Edit task..."
            error={touched && Boolean(formErrors.title)}
            helperText={touched ? formErrors.title : ""}
            sx={{
              "& .MuiInput-input": {
                paddingTop: "2px",
                paddingBottom: "2px",
                fontSize: "16px", // Keeps layout stable
              }
            }}
          />

          {/* Action Buttons */}
          <div className="flex gap-2 items-center flex-shrink-0 ml-2">

            {/* Save */}
            <IconButton
              onClick={() => handleSave()}
              sx={{
                  boxShadow: 2,
                  backgroundColor: "#548E48",
                  color: "black",
                  "&:hover": {
                      backgroundColor: "#46763C",
                  },
                  width: 25,
                  height: 25,
              }}
              disabled={isSaving}
            >
                <DoneIcon fontSize="small" />
            </IconButton>

            {/* Cancel */}
            <IconButton
              onClick={() => setIsEditing(false)}
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
                <CloseIcon fontSize="small" />  
            </IconButton>

            {formErrors.server && (
              <Typography color="error" variant="caption" sx={{ mt: -2 }}>
                  {formErrors.server}
              </Typography>
            )}

          </div>

        </Box>
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

          <div className="flex-1 min-w-0 mx-1">
              <Typography sx={{ fontSize: 18, textDecoration: task.completed ? "line-through" : "none" }}>
                  {task.title}
              </Typography>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 items-center flex-shrink-0">
            {/* Edit */}
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

            {/* Delete */}
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