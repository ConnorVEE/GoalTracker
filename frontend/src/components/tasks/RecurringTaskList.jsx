import React from "react";
import { Typography, Box, Paper, Button } from "@mui/material";

const weekdayMap = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function RecurringTaskList({ tasks, onUpdate, onDelete }) {
  if (!tasks || tasks.length === 0) {
    return (
      <Box mt={6}>
        <Typography variant="h6" gutterBottom sx={{ color: "#6A4C93" }}>
          Recurring Tasks
        </Typography>

        <Typography variant="body2" color="text.secondary">
          No recurring tasks found.
        </Typography>
      </Box>
    );
  }

  return (
    <Box mt={6}>
        <Typography variant="h6" gutterBottom sx={{ color: "#6A4C93" }}>
            Recurring Tasks
        </Typography>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.map((task) => (
            <Paper
              key={task.id}
              elevation={3}
              sx={{ backgroundColor: "#F3E8FF" }} // light pastel purple
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

                {task.goal && (
                    <Typography variant="caption" color="text.secondary">
                    Goal: {task.goal.name}
                    </Typography>
                )}
              </div>

              <div className="flex gap-2 mt-3">

                <Button
                    variant="outlined"
                    size="small"
                    onClick={() => onUpdate(task)}
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
    </Box>

  );
}