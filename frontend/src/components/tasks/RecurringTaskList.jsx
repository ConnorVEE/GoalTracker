import { useState } from "react";
import {
  Typography,
  Box,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, Controller } from "react-hook-form";

const weekdayMap = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const daysOfWeek = weekdayMap.map((name, value) => ({ name, value }));

export default function RecurringTaskList({ tasks, onUpdate, onDelete }) {
  const [editingTask, setEditingTask] = useState(null);

  const { control, register, handleSubmit, reset } = useForm({
    defaultValues: {
      title: "",
      recurrence_days: [],
    },
  });

  if (!tasks || tasks.length === 0) {
    return (
      <Box mt={6}>
        <Typography variant="h6" gutterBottom sx={{ color: "#6A4C93" }}>
          Recurring Tasks
        </Typography>
        <Typography variant="body2" color="text.secondary">
          No recurring tasks found
        </Typography>
      </Box>
    );
  }

  const startEditing = (task) => {
    setEditingTask(task);
    reset({
      title: task.title,
      recurrence_days: task.recurrence_rule?.days_of_week?.map(String) || [],
    });
  };

  const onSave = (data) => {
    const updatedData = {
      ...data,
      recurrence_rule: {
        days_of_week: data.recurrence_days.map(Number),
      },
    };
    onUpdate(editingTask.id, updatedData);
    setEditingTask(null);
  };

  return (
    <Box mt={6}>
      <Typography variant="h6" gutterBottom sx={{ color: "#6A4C93" }}>
        Recurring Tasks
      </Typography>

      {/* Render each recurring task */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.map((task) => (
          <Paper
            key={task.id}
            elevation={3}
            sx={{ backgroundColor: "#F3E8FF" }}
            className="p-4 flex flex-col justify-between"
          >
            <div>
              <Typography variant="subtitle1" fontWeight="bold">
                {task.title}
              </Typography>

              {task.recurrence_rule?.days_of_week?.length > 0 && (
                <Typography variant="body2" color="text.secondary">
                  {task.recurrence_rule.days_of_week
                    .map((d) => weekdayMap[d])
                    .join(", ")}
                </Typography>
              )}
            </div>

            <div className="flex gap-2 mt-3">
              <Button
                variant="outlined"
                size="small"
                onClick={() => startEditing(task)}
              >
                Edit
              </Button>

              <Button
                variant="contained"
                color="error"
                size="small"
                onClick={() => onDelete(task.id)}
              >
                Delete
              </Button>
            </div>
          </Paper>
        ))}
      </div>

      {/* Animate the dialog */}
      <AnimatePresence>
        {editingTask && (
          <motion.div
            key={editingTask.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            <Dialog
              open={!!editingTask}
              onClose={() => setEditingTask(null)}
              fullWidth
              maxWidth="sm"
            >
              <DialogTitle>Edit Recurring Task</DialogTitle>

              <DialogContent sx={{ py: 4 }}>
                <TextField
                  fullWidth
                  label="Title"
                  {...register("title", { required: true })}
                  margin="normal"
                />

                <Controller
                  name="recurrence_days"
                  control={control}
                  render={({ field }) => {
                    const selected = field.value || [];
                    return (
                      <div>
                        <Typography className="mb-2">Repeat on:</Typography>

                        <div className="flex gap-2 flex-wrap">
                          {daysOfWeek.map((day) => {
                            const isSelected = selected.includes(
                              day.value.toString()
                            );
                            return (
                              <button
                                key={day.value}
                                type="button"
                                className={`px-3 py-1 rounded-md border text-sm font-medium transition
                                  ${isSelected
                                    ? "bg-purple-600 text-white border-purple-600"
                                    : "bg-white text-gray-800 border-gray-300 hover:bg-purple-100"
                                  }`}
                                onClick={() => {
                                  const updated = isSelected
                                    ? selected.filter(
                                        (val) => val !== day.value.toString()
                                      )
                                    : [...selected, day.value.toString()];
                                  field.onChange(updated);
                                }}
                              >
                                {day.name}
                              </button>
                            );
                          })}
                        </div>

                      </div>
                    );
                  }}
                />
              </DialogContent>

              <DialogActions>
                <Button onClick={() => setEditingTask(null)}>Cancel</Button>
                <Button variant="contained" onClick={handleSubmit(onSave)}>Save</Button>
              </DialogActions>

            </Dialog>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
}