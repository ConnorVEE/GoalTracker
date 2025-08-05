import { useEffect, useState } from "react";
import { getGoals } from "../api/goalRoutes";
import { createTask, deleteTask, updateTask, getRecurringTasks, getTasksByRange } from "../api/taskRoutes";
import TaskCreationForm from "../components/tasks/TaskCreationForm";
import CalendarView from "../components/tasks/CalendarView";
import RecurringTaskList from "../components/tasks/RecurringTaskList";
import { Snackbar, Alert } from "@mui/material";

export default function TasksPage() {
  const [isLoading, setLoading] = useState(false);
  const [calendarView, setCalendarView] = useState("month");
  const [showForm, setShowForm] = useState(false);
  const [goals, setGoals] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [recurringTasks, setRecurringTasks] = useState([]);
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // load tasks for the calendar
  const loadTasksByRange = async (start, end) => {
    try {
      const res = await getTasksByRange(start, end);
      setTasks(res.data);
    } catch (err) {
      console.error("Failed to load tasks:", err);
    }
  };

  const loadRecurringTasks = async () => {
    try {
      const res = await getRecurringTasks();
      setRecurringTasks(res.data);
    } catch (err) {
      console.error("Failed to load recurring tasks:", err);
    }
  };

  const refreshAllTasks = async () => {
    if (dateRange.start && dateRange.end) {
      await loadTasksByRange(dateRange.start, dateRange.end);
    }
    await loadRecurringTasks();
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };
  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  const handleTaskCreate = async (taskData) => {
    setLoading(true);

    try {
      await createTask(taskData);
      showSnackbar("Task created!");
      await refreshAllTasks();

    } catch (err) {
      console.error("Create failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRecurringTaskUpdate = async (taskId, updatedData) => {
    setLoading(true);

    try {
      await updateTask(taskId, updatedData);
      showSnackbar("Task updated!");
      await refreshAllTasks();

    } catch (err) {
      console.error("Update failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRecurringTaskDelete = async (taskId) => {
    setLoading(true);

    try {
      await deleteTask(taskId);
      showSnackbar("Task deleted successfully");
      await refreshAllTasks();

    } catch (err) {
      console.error("Delete failed:", err);

    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    const fetchData = async () => {

      try {
        const [goalsRes, recurringRes] = await Promise.all([
          getGoals(),
          getRecurringTasks(),
        ]);

        setGoals(goalsRes.data);
        setRecurringTasks(recurringRes.data);

      } catch (err) {
        console.error("Failed to fetch data:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="px-4 py-6 max-w-6xl mx-auto space-y-8">

      <h1 className="text-3xl font-bold text-purple-800 text-center">Task Management and Overview</h1>
      
      {/* Calendar view and task creation form */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowForm(prev => !prev)}
          className="bg-purple-400 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition"
        >
          {showForm ? "Hide Task Creator" : "Create New Task?"}
        </button>
      </div>

      {/* Task creation form */}
      {showForm && <TaskCreationForm onCreate={handleTaskCreate} isLoading={isLoading} goals={goals}/>}

      {/* Calendar view component */}
      <div className="relative" style={{ minHeight: calendarView === "month" ? "640px" : "420px" }}>
        <CalendarView
          tasks={tasks}
          onViewChange={setCalendarView}
          onRangeChange={setDateRange}
          loadTasksByRange={loadTasksByRange}
        />
      </div>

      <RecurringTaskList
        tasks={recurringTasks}
        onUpdate={handleRecurringTaskUpdate}
        onDelete={handleRecurringTaskDelete}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

    </div>
  );
}