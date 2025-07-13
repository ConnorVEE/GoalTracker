import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { getTasksByDate, createTask } from "../api/taskRoutes";
import TaskCreationForm from "../components/tasks/TaskCreationForm";
// import CalendarView from "@/components/CalendarView";
// import RecurringTaskList from "@/components/RecurringTaskList";

export default function TasksPage() {
  const [viewType, setViewType] = useState("week"); // 'week' or 'month'
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const handleCreate = async (taskData) => {
    setLoading(true);

    try {
      await createTask(taskData);
      // Optionally trigger toast or task refresh here

    } catch (err) {
      console.error("Create failed:", err);
    } finally {
      setLoading(false);
    }
  };

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
      {showForm && <TaskCreationForm onCreate={handleCreate} isLoading={isLoading}/>}

      {/* Calendar View */}
      {/* <CalendarView viewType={viewType} setViewType={setViewType} /> */}

      {/* Recurring Tasks Section */}
      {/* <RecurringTaskList /> */}
    </div>
  );
}