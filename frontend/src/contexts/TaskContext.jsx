import { createContext, useReducer, useEffect } from "react";
import { 
    createTask, 
    getTasks, 
    getTasksByDate, 
    getTasksByRange, 
    getRecurringTasks, 
    updateTask, 
    deleteTask
} from "../api/taskRoutes"

const TaskContext = createContext();

const initialState = {
  tasks: [],
  loading: false,
  error: null,
};

function taskReducer(state, action) {

  switch (action.type) {
    case "SET_TASKS":
      return { ...state, tasks: action.payload, loading: false };
    case "ADD_TASK":
      return { ...state, tasks: [...state.tasks, action.payload] };
    case "UPDATE_TASK":
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.payload.id ? action.payload : t
        ),
      };
    case "DELETE_TASK":
      return {
        ...state,
        tasks: state.tasks.filter((t) => t.id !== action.payload),
      };
    case "TOGGLE_COMPLETE":
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.payload.id
            ? { ...t, completed: action.payload.completed }
            : t
        ),
      };
    case "LOADING":
      return { ...state, loading: true };
    case "ERROR":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

export const TaskProvider = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  // Fetch all tasks
  const fetchAllTasks = async () => {
    dispatch({ type: "LOADING" });
    try {
      const res = await getTasks();
      dispatch({ type: "SET_TASKS", payload: res.data });

    } catch (err) {
      console.error("Failed to fetch all tasks:", err);
      dispatch({ type: "ERROR", payload: err });

    }
  };

  // Fetch tasks for a specific date
  const fetchTasksByDate = async (date) => {
    dispatch({ type: "LOADING" });
    try {
      const res = await getTasksByDate(date);
      dispatch({ type: "SET_TASKS", payload: res.data });

    } catch (err) {
      console.error("Failed to fetch tasks:", err);
      dispatch({ type: "ERROR", payload: err });

    }
  };

  // Add a new task
  const addTask = async (payload) => {
    try {
      const res = await createTask(payload);
      dispatch({ type: "ADD_TASK", payload: res.data });

    } catch (err) {
      console.error("Failed to create task:", err);
      
    }
  };

  // Update a task
  const editTask = async (id, updatedData) => {
    try {
      const res = await updateTask(id, updatedData);
      dispatch({ type: "UPDATE_TASK", payload: res.data });
    } catch (err) {
      console.error("Failed to update task:", err);
    }
  };

  // Delete a task
  const removeTask = async (id) => {
    try {
      await deleteTask(id);
      dispatch({ type: "DELETE_TASK", payload: id });
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
  };

  // Toggle task completion (for checkbox persistence)
  const toggleTaskCompletion = async (id, completed) => {
    try {
      const res = await updateTask(id, { completed });
      dispatch({
        type: "TOGGLE_COMPLETE",
        payload: { id, completed: res.data.completed },
      });
    } catch (err) {
      console.error("Failed to toggle completion:", err);
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks: state.tasks,
        loading: state.loading,
        error: state.error,
        fetchTasksByDate,
        fetchAllTasks,
        addTask,
        editTask,
        removeTask,
        toggleTaskCompletion,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export { TaskContext };