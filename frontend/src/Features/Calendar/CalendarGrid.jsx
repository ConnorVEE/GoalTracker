import React  from "react";
// components
import CalendarDay from "./CalendarDay";
// Utilities
import { getLocalDateString, formatMonthHeader } from "../../utils/DateUtils";
// MUI
import { Button, IconButton } from "@mui/material";
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const CalendarGrid = ({ grid, tasksByDate, onSelectDate, selectedDate, currentDate, handleNavigate, handleGoToToday }) => {
  const today = getLocalDateString(new Date());
  const monthHeader = formatMonthHeader(currentDate);

  return (
    <div className="space-y-2">

      {/* Month Header */}
      <div className="flex justify-center items-center gap-3 py-1">

        <div className="flex justify-end pr-4">
          <Button
            variant="outlined"
            onClick={() => handleGoToToday()}
            sx={{
              color: "text.primary",
              boxShadow: 2,
            }}
          >
            Today
          </Button>
        </div>
        

        {/* left */}
        <IconButton
          onClick={() => handleNavigate(-1)}
          sx={{
            boxShadow: 2,
            color: "text.primary",
            "&:hover": {
                backgroundColor: "#d4a93f",
            },
            width: 25,
            height: 25,
          }}
        >
          <WestIcon fontSize="medium"/>
        </IconButton>
        <div className="text-center text-xl font-bold px-2">{monthHeader}</div>
        {/* right */}
        <IconButton
          onClick={() => handleNavigate(1)}
          sx={{
            boxShadow: 2,
            color: "text.primary",
            "&:hover": {
                backgroundColor: "#d4a93f",
            },
            width: 25,
            height: 25,
          }}
        >
          <EastIcon fontSize="medium"/>
        </IconButton>

      </div>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 text-center text-white text-lg font-medium">
        {weekdays.map((day) => (
          <div className="text-lg" key={day}>{day}</div>
        ))}
      </div>

      {/* Line separator */}
      <div className="border-t-2 border-[#678498] pt-2 space-y-2">

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {grid.map((day) => (
            <CalendarDay 
              key={day.date} 
              date={day.date} 
              tasks={tasksByDate[day.date] || []}
              onSelectDate={onSelectDate}
              isToday={day.date === today}
              isSelected={day.date === selectedDate}
              isCurrentMonth={day.isCurrentMonth}
            />
          ))}
        </div>
        
      </div>
    </div>
  );
}

export default CalendarGrid;