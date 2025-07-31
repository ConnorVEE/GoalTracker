import { useEffect, useState } from "react";
import { getGoals } from "../api/goalRoutes";
import { getTasks, createTask, getRecurringTasks, deleteTask } from "../api/taskRoutes";
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
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // Load recurring tasks
  const loadRecurringTasks = async () => {
    try {
      const res = await getRecurringTasks();
      setRecurringTasks(res.data);
    } catch (err) {
      console.error("Failed to load recurring tasks:", err);
    }
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  // Task creation handler
  const handleTaskCreate = async (taskData) => {
    setLoading(true);

    try {
      await createTask(taskData);
      showSnackbar("Task created!");
      const refreshed = await getTasks();
      setTasks(refreshed.data);

    } catch (err) {
      console.error("Create failed:", err);
    } finally {
      setLoading(false);
    }
  };

  // Recurring task updating handler 
  const handleRecurringTaskUpdate = async (taskId, updatedData) => {
    setLoading(true);

    try {
      await updateTask(taskId, updatedData);
      showSnackbar("Task updated!");
      await loadRecurringTasks();

    } catch (err) {
      console.error("Update failed:", err);

    } finally {
      setLoading(false);
    }
  };

  // Recurring task deletion handler
  const handleRecurringTaskDelete = async (taskId) => {
    setLoading(true);

    try {
      await deleteTask(taskId);
      showSnackbar("Task deleted successfully");
      await loadRecurringTasks();

    } catch (err) {
      console.error("Delete failed:", err);

    } finally {
      setLoading(false);
    }
  };

  // fetch goals and tasks on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [goalsRes, tasksRes, recurringRes] = await Promise.all([
          getGoals(),
          getTasks(),
          getRecurringTasks(),
        ]);

        setGoals(goalsRes.data);
        setTasks(tasksRes.data);
        setRecurringTasks(recurringRes.data);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="px-4 py-6 max-w-6xl mx-auto space-y-8">

      {/* Page Title */}
      <h1 className="text-3xl font-bold text-purple-800 text-center">Task Manager and Overview</h1>
      
      {/* Toggle Button for Task Creation Form */}
      <div className="flex items-center justify-between">

        <button
          onClick={() => setShowForm(prev => !prev)}
          className="bg-purple-400 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition"
        >
          {showForm ? "Hide Task Creator" : "Create New Task?"}
        </button>
        
      </div>

      {/* Task Creation Form */}
      {showForm && <TaskCreationForm onCreate={handleTaskCreate} isLoading={isLoading} goals={goals}/>}

      {/* Calendar View */}
      <div
        className="relative"
        style={{
          minHeight: calendarView === "month" ? "640px" : "120px"
        }}
      >
        <CalendarView onViewChange={setCalendarView} />
      </div>

      {/* Recurring Tasks Section */}
      <RecurringTaskList tasks={recurringTasks} onUpdate={handleRecurringTaskUpdate} onDelete={handleRecurringTaskDelete}/>

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