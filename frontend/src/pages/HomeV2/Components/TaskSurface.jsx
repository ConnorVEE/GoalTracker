import React from "react";
// MUI
import { Box, Typography } from "@mui/material";
// Components
import TaskContainer from "./TaskContainer";

const TaskSurface = () => {
  return (
    <div className="border border-dashed border-gray-400 p-4 rounded my-6">

        <Box sx={{
          p: 3, 
          borderRadius: 2, 
          maxWidth: 1300, 
          margin: "0 auto",
          backgroundColor: "background.paper",
          display: "block", 
          minHeight: 400, // Temporary height for visual testing
        }}>
            <TaskContainer />
        </Box>
    </div>
  );
};  

export default TaskSurface;