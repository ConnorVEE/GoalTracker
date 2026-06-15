import { useState } from "react";
// Components
import TaskItem from "./TaskItem";
// Utils
import { formatFullDate } from "../../utils/DateUtils";
// MUI 
import { Box, Typography, IconButton, TextField } from "@mui/material"
import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';

const TaskListPanel = ({ date, tasks, onToggle, onCreate, onEdit, onDelete }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [error, setError] = useState(null);
  const [touched, setTouched] = useState(false);
  const titleError = touched && newTitle.trim() === "";
  let titleMaxChars = 50;

  const handleToggle = async (task) => {
    setError(null);
    setIsSaving(true);

    try {
      await onToggle(task, !task.completed);
    } catch (err) {
      setError("Failed to update task.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreate = async () => {
    setError(null);

    if (!newTitle.trim()) {
      setTouched(true);
      return;
    }

    setIsSaving(true);
    
    try {
      await onCreate(newTitle);
      setNewTitle("");
      setIsCreating(false);

    } catch (err) {
      console.error("Failed to create task:", err);
      setError("Failed to create task. Please try again.");
      return;

    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = async (task, updatedData) => {
    setError(null);

    if (!updatedData.title.trim()) {
      setError("Task title cannot be empty.");
      return;
    }
    setIsSaving(true);

    try {
      await onEdit(task, updatedData);

    } catch (err) {
      console.error("Failed to edit task:", err);
      setError("Failed to edit task. Please try again.");
      return;

    } finally {
      setIsSaving(false);
    }
    
  };

  const handleDelete = async (task) => {
    setError(null);
    setIsSaving(true);
    
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    try {
      await onDelete(task);

    } catch (err) {
      console.error("Failed to delete task:", err);
      setError("Failed to delete task. Please try again.");
      return;

    } finally {
      setIsSaving(false);
    }
  }

  // RETURNS
  if (!date) return <div className="p-2 mt-2 border-t-2 border-[#678498]"><p>Select a day</p></div>;

  return (
    <div className="p-2 mt-2 border-t-2 border-[#678498]">

      <h3 className="text-md font-semibold pb-1">Tasks for {formatFullDate(date)}</h3>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="flex flex-wrap gap-3 py-3">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={() => handleToggle(task)}
            onEdit={handleEdit}
            onDelete={() => handleDelete(task)}
            isSaving={isSaving}
            error={error}
          />
        ))}
      </div>

      {isCreating ? (
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
            value={newTitle}
            onChange={(e) => !isSaving && setNewTitle(e.target.value)}
            onBlur={() => setTouched(true)}
            placeholder="New task title..."
            error={titleError}
            inputProps={{ maxLength: titleMaxChars }}
            helperText={
                <Box component="span" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>{newTitle.length} / {titleMaxChars}</span>
                    <span>{touched ? titleError && "Title cannot be empty" : ""}</span>
                </Box>
             }
            sx={{
              "& .MuiInput-input": {
                paddingTop: "2px",
                paddingBottom: "2px",
                fontSize: "16px", // Keeps layout stable
              }
            }}
          />

          {/* Action buttons */}
          <div className="flex gap-2 items-center flex-shrink-0 ml-2">

            {/* Save */}
            <IconButton
              onClick={() => handleCreate()}
              disabled={isSaving}
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
            >
              <DoneIcon fontSize="small" />
            </IconButton>

            {/* Cancel */}
            <IconButton
              onClick={() => setIsCreating(false)}
              disabled={isSaving}
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
            >
              <CloseIcon fontSize="small" />
            </IconButton>

          </div>

        </Box>
        ) : (
        <button 
          className="rounded-3xl border-[#678498] border-2 p-2" 
          onClick={() => {
            setIsCreating(true);
            setTouched(false);
            setNewTitle("");
            setError(null);
          }} 
          disabled={isSaving}>
            + Add Task
        </button>
      )}
    </div>
  );
};

export default TaskListPanel;