import React from "react";
// Context
import { useTasks } from "../../../contexts/useTasks";

const CalendarDay = ({ date, tasks, onSelectDate }) => { 

    return (
        <div onClick={() => onSelectDate(date)}>
          <p>{date}</p>
          
          {tasks.map(task => (
            <button key={task.id} >
              {task.completed ? "✅" : "⬜"} {task.title}
            </button>
            //   <p key={task.id}>{task.title}</p>
          ))}
        </div>
    )
}

export default CalendarDay;