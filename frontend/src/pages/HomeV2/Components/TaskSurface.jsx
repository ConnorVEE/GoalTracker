import React from "react";
// MUI
import { Box, Typography } from "@mui/material";

const TaskSurface = () => {
  return (
    <div className="border border-dashed border-gray-400 p-4 rounded my-6">
        <h2 className="text-sm font-semibold">
            TaskSurface
        </h2>

        <h2>Selected date</h2>

        <Box sx={{
          p: 3, 
          borderRadius: 2, 
          maxWidth: 1200, 
          margin: "0 auto",
          backgroundColor: "background.paper",
          display: "block", 
          minHeight: 300, // Temporary height for visual testing
        }}>
            <Typography variant="h6" className="mb-4">
                Task List / Calendar View
            </Typography>
        </Box>

        <h2>Date Controls & toggle button</h2>
    </div>
  );
};  

export default TaskSurface;