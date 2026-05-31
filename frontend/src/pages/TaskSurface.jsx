import React from "react";
// MUI
import { Box, Typography } from "@mui/material";
import { shadows } from "@mui/system";
// Components
import TaskContainer from "./TaskContainer";

const TaskSurface = () => {
  return (
    <div className="p-4 rounded ">

        <Box sx={{
          py: 2, 
          px: 3,
          borderRadius: 2, 
          maxWidth: 1300, 
          margin: "0 auto",
          backgroundColor: "background.lev1",
          display: "block", 
          minHeight: 400, // Temporary height for visual testing
          boxShadow: 3,
        }}>
            <TaskContainer />
        </Box>
    </div>
  );
};  

export default TaskSurface;