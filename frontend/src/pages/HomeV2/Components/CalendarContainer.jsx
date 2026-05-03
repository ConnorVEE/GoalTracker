import { useState, useEffect, useMemo } from "react";
// Context
import { useTasks } from "../../../contexts/useTasks";
// Components
import CalendarGrid from "./CalendarGrid";
// Utilites 
import { buildVisibleTasksByRange } from "../../../utils/tasks/TaskGenUtils";
import { groupTasksByDate, generateMonthGrid } from "../../../utils/calendarUtils";

const CalendarContainer = () => {
  const { fetchTasksByRange, tasks } = useTasks();
  const [view, setView] = useState("month");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const grid = generateMonthGrid(currentDate);
  const start = grid[0].date;
  const end = grid[grid.length - 1].date;

  // Create visible tasks by range
  const visibleTasks = useMemo(() => {
    return buildVisibleTasksByRange(tasks, start, end);

  }, [tasks, start, end]);

  const tasksByDate = useMemo(() => {
    return groupTasksByDate(visibleTasks, grid);

  }, [visibleTasks, grid]);

  const selectedTasks = useMemo(() => {
    if (!selectedDate) return [];
    return tasksByDate[selectedDate] || [];

  }, [selectedDate, tasksByDate]);

  useEffect(() => {
    fetchTasksByRange(start, end);
  }, [start, end, fetchTasksByRange]);

  return (
    <div className="border border-dashed border-gray-400 p-4 rounded my-6">

      <CalendarGrid 
        grid={grid}
        tasksByDate={tasksByDate}
        onSelectDate={setSelectedDate}
      />

      {selectedDate && (
        <div>
          <h3>Tasks for {selectedDate}</h3>
          {selectedTasks.map(task => (
            <p key={task.id}>{task.title}</p>
          ))}
        </div>
      )}
    </div>
  );
}

export default CalendarContainer;