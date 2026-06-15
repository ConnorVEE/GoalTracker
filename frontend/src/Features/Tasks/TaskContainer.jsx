import { useState, useEffect, useMemo } from "react";
// Context
import { useTasks } from "./Hooks/useTasks.js";
// Components
import CalendarGrid from "../Calendar/CalendarGrid.jsx";
import TaskListPanel from "./TaskListPanel.jsx";
// Utilites 
import { buildVisibleTasksByRange } from "../../utils/tasks/TaskGenUtils.js";
import { groupTasksByDate, generateMonthGrid } from "../../utils/calendarUtils.js";
// MUI
import { Box } from "@mui/material";
import { shadows } from "@mui/system";

const TaskContainer = () => {
  const { fetchTasksByRange, tasks, toggleTaskCompletion, addTask, editTask, deleteTaskItem } = useTasks();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const grid = generateMonthGrid(currentDate);
  const start = grid[0].date;
  const end = grid[grid.length - 1].date;

  const handleGoToToday = () => {
    setCurrentDate(new Date());
  };

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
    <Box 
      sx={{
        py: 2, 
        px: 3,
        borderRadius: 2, 
        maxWidth: 1300, 
        margin: "0 auto",
        backgroundColor: "background.lev1",
        display: "block", 
        minHeight: 400, // Temporary height for visual testing
        boxShadow: 3,
      }}
    >

      <CalendarGrid 
        grid={grid}
        tasksByDate={tasksByDate}
        onSelectDate={setSelectedDate}
        selectedDate={selectedDate}
        currentDate={currentDate}
        handleNavigate={handleNavigate}
        handleGoToToday={handleGoToToday}
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

    </Box>
  );
}

export default TaskContainer;