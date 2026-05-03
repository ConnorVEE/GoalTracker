import React from "react";

const CalendarDay = ({ date, tasks, onSelectDate }) => { 
    return (
        <div onClick={() => onSelectDate(date)}>
          <p>{date}</p>
          
          {tasks.map(task => (
              <p key={task.id}>{task.title}</p>
          ))}
        </div>
    )
}

export default CalendarDay;