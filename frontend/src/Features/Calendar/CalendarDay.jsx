import React from "react";
// Context
import { useTasks } from "../Tasks/Hooks/useTasks.js";
// MUI
import { Box, Typography } from "@mui/material";
import { shadows } from "@mui/system";
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
// Utils
import { formatCalendarNumber } from "../../utils/DateUtils.js";

const CalendarDay = ({ date, tasks, onSelectDate, isToday, isSelected, isCurrentMonth }) => { 
  const visibleTasks = tasks.slice(0, 3);
  const overflowCount = tasks.length - visibleTasks.length;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  let borderStyle = "1px solid transparent";
  let backgroundColor = "grey";

  if (isToday) {
    borderStyle = "2px solid #fff";
  }
  if (isCurrentMonth) {
    backgroundColor = "background.lev2";
  }

  if (isSelected) {
    borderStyle = "2px solid #EBBE4D";
  }

  return (
    <Box
      sx={{
        backgroundColor: backgroundColor,
        minHeight: "105px", 
        borderRadius: 1,
        padding: 0.5,
        display: "flex",
        flexDirection: "column",
        boxShadow: 2,
        border: borderStyle,
        "&:hover": {
          backgroundColor: "lightgray",
          cursor: "pointer"
        }
      }}
      onClick={() => onSelectDate(date)}
    >

      <Typography variant="body2">
          {formatCalendarNumber(date)}
      </Typography>

      {isMobile ? (
        <>
          {visibleTasks.map(task => (

            <Box key={task.id} sx={{ display: "flex", alignItems: "center", gap: "6px", width: "100%", py: 0.2 }}>

              {task.completed ? (
                <RadioButtonCheckedIcon 
                  fontSize="small" 
                  sx={{ 
                    color: "#E5B842", 
                    flexShrink: 0 
                  }} 
                />
              ) : (
                <RadioButtonUncheckedIcon 
                  fontSize="small" 
                  sx={{ 
                    color: "#A9B4BC", 
                    flexShrink: 0 
                  }} 
                />
              )}

            </Box>

          ))}
            
          {overflowCount > 0 && (
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              +{overflowCount}
            </Typography>
          )}
        </>

       ) : (
        <>
          {visibleTasks.map(task => (
            <Typography 
              key={task.id}
              variant="body2"
              sx={{ 
                textDecoration: task.completed ? "line-through" : "none",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                width: "100%",
              }}  
            >

              {task.completed ? (
                <RadioButtonCheckedIcon 
                  fontSize="small" 
                  sx={{ 
                    color: "#E5B842", 
                    flexShrink: 0 
                  }} 
                />
              ) : (
                <RadioButtonUncheckedIcon 
                  fontSize="small" 
                  sx={{ 
                    color: "#A9B4BC", 
                    flexShrink: 0 
                  }} 
                />
              )}
              
              {/* Wrapping the title in a span ensures it behaves correctly alongside the flex icon */}
              <span className="truncate">{task.title}</span>
            </Typography>
          ))}
          
          {overflowCount > 0 && (
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              +{overflowCount} more
            </Typography>
          )}
        </>

      )}

    </Box>
  )
}

export default CalendarDay;