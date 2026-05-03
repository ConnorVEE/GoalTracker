import React  from "react";
// components
import CalendarDay from "./CalendarDay";

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const CalendarGrid = ({ grid, tasksByDate, onSelectDate }) => {

  return (
    <div className="space-y-2">
      
      {/* Weekday Labels */}
      <div className="grid grid-cols-7 text-center text-sm text-gray-500 font-medium">
        {weekdays.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* Line separator */}
      <div className="border-t border-gray-400 pt-2 space-y-2">

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {grid.map((day) => (
            <CalendarDay 
              key={day.date} 
              date={day.date} 
              tasks={tasksByDate[day.date] || []}
              onSelectDate={onSelectDate}
            />
          ))}
        </div>
        
      </div>
    </div>
  );
}

export default CalendarGrid;