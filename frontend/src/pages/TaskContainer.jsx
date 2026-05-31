import { useState, useEffect, useMemo } from "react";
// Context
import { useTasks } from "../Features/Tasks/Hooks/useTasks.js";
// Components
import CalendarGrid from "../Features/Calendar/CalendarGrid";
import TaskListPanel from "../Features/Tasks/TaskListPanel";
// Utilites 
import { buildVisibleTasksByRange } from "../utils/tasks/TaskGenUtils";
import { groupTasksByDate, generateMonthGrid } from "../utils/calendarUtils";

const CalendarContainer = () => {
  const { fetchTasksByRange, tasks, toggleTaskCompletion, addTask, editTask, deleteTaskItem } = useTasks();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const grid = generateMonthGrid(currentDate);
  const start = grid[0].date;
  const end = grid[grid.length - 1].date;

  // Navigate month view
  const handleNavigate = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(1);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };
  
  // Create visible tasks by range
  const visibleTasks = useMemo(() => {
    return buildVisibleTasksByRange(tasks, start, end);

  }, [tasks, start, end]);

  // Group tasks by date for calendar display
  const tasksByDate = useMemo(() => {
    return groupTasksByDate(visibleTasks, grid);

  }, [visibleTasks, grid]);

  // Get tasks for selected date
  const selectedTasks = useMemo(() => {
    if (!selectedDate) return [];
    return tasksByDate[selectedDate] || [];

  }, [selectedDate, tasksByDate]);

  useEffect(() => {
    fetchTasksByRange(start, end);
  }, [start, end, fetchTasksByRange]);

  return (
    <div className="">

      <CalendarGrid 
        grid={grid}
        tasksByDate={tasksByDate}
        onSelectDate={setSelectedDate}
        selectedDate={selectedDate}
        currentDate={currentDate}
        handleNavigate={handleNavigate}
      />

      <TaskListPanel 
        date={selectedDate}
        tasks={selectedTasks}
        onToggle={toggleTaskCompletion}
        onCreate={(title) => addTask({
          title: title,
          date: selectedDate,
        })}
        onEdit={editTask}
        onDelete={deleteTaskItem}
      />

    </div>
  );
}

export default CalendarContainer;