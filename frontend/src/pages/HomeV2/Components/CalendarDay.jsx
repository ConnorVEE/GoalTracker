import React from "react";
// Context
import { useTasks } from "../../../contexts/useTasks";
// MUI
import { Box, Typography } from "@mui/material";
import { shadows } from "@mui/system";
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
// Utils
import { formatCalendarNumber } from "../../../utils/DateUtils.js";

const CalendarDay = ({ date, tasks, onSelectDate, isToday, isSelected, isCurrentMonth }) => { 
  const visibleTasks = tasks.slice(0, 3);
  const overflowCount = tasks.length - visibleTasks.length;
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

  // if (isSelected) {
  //   console.log("Selected date:", date);
  // }

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
      <p className="text-sm font-normal leading-normal">{formatCalendarNumber(date)}</p>

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
        <p className="text-sm font-normal leading-normal">+{overflowCount} more</p>
      )}

    </Box>
  )
}

export default CalendarDay;