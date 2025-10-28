import { useEffect, useState } from "react";
import { getGoals } from "../api/goalRoutes";
import { useTasks } from "../contexts/useTasks";
import TaskCreationForm from "../components/tasks/TaskCreationForm";
import CalendarView from "../components/tasks/CalendarView";
import RecurringTaskList from "../components/tasks/RecurringTaskList";
import { Snackbar, Alert } from "@mui/material";
import { Helmet } from "react-helmet-async";

export default function TasksPage() {
  const [calendarView, setCalendarView] = useState("month");
  const [showForm, setShowForm] = useState(false);
  const [goals, setGoals] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  // Initial data fetch of goals
  useEffect(() => {
    const fetchData = async () => {

      try {
        const [goalsRes] = await Promise.all([
          getGoals(),
        ]);
        setGoals(goalsRes.data);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="px-4 py-6 max-w-6xl mx-auto space-y-8">
      <Helmet>
        <title>TodoAllDay | Tasks</title>
      </Helmet>

      <h1 className="text-3xl font-bold text-purple-800 text-center">Task Management and Overview</h1>
      
      {/* Task creation form */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowForm(prev => !prev)}
          className="bg-purple-400 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition"
        >
          {showForm ? "Hide Task Creator" : "Create New Task?"}
        </button>
      </div>

      {/* Task creation form */}
      {showForm && <TaskCreationForm goals={goals}/>}

      {/* Calendar + Recurring Tasks container */}
      <div className="mt-4">
        <CalendarView
          onViewChange={setCalendarView}
          view={calendarView}
        />
        <RecurringTaskList/>
      </div>

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