import { useEffect, useState } from "react";
import { getGoals } from "../api/goalRoutes";
import { getTasks } from "../api/taskRoutes";
import { createTask } from "../api/taskRoutes";
import TaskCreationForm from "../components/tasks/TaskCreationForm";
import CalendarView from "../components/tasks/CalendarView";
// import RecurringTaskList from "@/components/RecurringTaskList";

export default function TasksPage() {
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [goals, setGoals] = useState([]);
  const [tasks, setTasks] = useState([]); // Assuming tasks will be fetched or passed down

  // Task creation handler
  const handleCreate = async (taskData) => {
    setLoading(true);

    try {
      await createTask(taskData);
      const refreshed = await getTasks();
      setTasks(refreshed.data);

    } catch (err) {
      console.error("Create failed:", err);
    } finally {
      setLoading(false);
    }
  };

  // fetch goals and tasks on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [goalsRes, tasksRes] = await Promise.all([
          getGoals(),
          getTasks(),
        ]);

        setGoals(goalsRes.data);
        setTasks(tasksRes.data);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="px-4 py-6 max-w-6xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">

        <h1 className="text-3xl font-bold text-purple-800">Tasks Manager</h1>

        <button
          onClick={() => setShowForm(prev => !prev)}
          className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition"
        >
          {showForm ? "Hide Task Creator" : "Create New Task?"}
        </button>
        
      </div>

      {/* Task Creation Form */}
      {showForm && <TaskCreationForm onCreate={handleCreate} isLoading={isLoading} goals={goals}/>}

      {/* Calendar View */}
      <CalendarView tasks={tasks}/>

      {/* Recurring Tasks Section */}
      {/* <RecurringTaskList /> */}
    </div>
  );
}