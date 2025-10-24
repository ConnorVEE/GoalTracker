import { createContext, useReducer, useCallback } from "react";
import { 
    createTask,  
    getTasksByDate, 
    getTasksByRange, 
    getRecurringTasks, 
    updateTask, 
    deleteTask
} from "../api/taskRoutes"

const TaskContext = createContext();

const initialState = {
  tasks: [],
  recurringTasks: [],
  loading: false,
  error: null,
};

function taskReducer(state, action) {
  switch (action.type) {
    case "SET_TASKS":
      return { ...state, tasks: action.payload, loading: false };
    case "SET_RECURRING_TASKS":
      return { ...state, recurringTasks: action.payload, loading: false };
    case "ADD_TASK":
      const newTask = action.payload;
      const isRecurring = !!newTask.recurrence_rule;
      return { 
        ...state, 
        tasks: [...state.tasks, newTask],
        recurringTasks: isRecurring
            ? [...state.recurringTasks, newTask]
            : state.recurringTasks,
        loading: false 
      };
    case "UPDATE_TASK":
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.payload.id ? action.payload : t
        ),
        recurringTasks: state.recurringTasks.map((t) =>
          t.id === action.payload.id ? action.payload : t
        ),
        loading: false, 
      };
    case "DELETE_TASK":
      return {
        ...state,
        tasks: state.tasks.filter((t) => t.id !== action.payload),
        recurringTasks: state.recurringTasks.filter((t) => t.id !== action.payload),
        loading: false, 
      };
    case "TOGGLE_COMPLETE":
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.payload.id
            ? { ...t, completed: action.payload.completed }
            : t
        ),
        loading: false, 
      };
    case "LOADING":
      return { ...state, loading: true, error: null }; // 👈 Reset error on loading
    case "ERROR":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

export const TaskProvider = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  // Add a new task (The one used by TaskCreationForm)
  const addTask = async (payload) => {
    dispatch({ type: "LOADING" }); // 👈 Start loading
    try {
      const res = await createTask(payload);
      dispatch({ type: "ADD_TASK", payload: res.data });

    } catch (err) {
      console.error("Failed to create task:", err);
      dispatch({ type: "ERROR", payload: err }); // 👈 Stop loading on error
      
    }
  };

  // Update a task
  const editTask = async (id, updatedData) => {
    dispatch({ type: "LOADING" }); // 👈 Start loading
    try {
      const res = await updateTask(id, updatedData);
      dispatch({ type: "UPDATE_TASK", payload: res.data });

    } catch (err) {
      console.error("Failed to update task:", err);
      dispatch({ type: "ERROR", payload: err }); // 👈 Stop loading on error
    }
  };

  // Delete a task
  const removeTask = async (id) => {
    dispatch({ type: "LOADING" }); // 👈 Start loading
    try {
      await deleteTask(id);
      dispatch({ type: "DELETE_TASK", payload: id });
      // The loading is set to false inside the DELETE_TASK case
      
    } catch (err) {
      console.error("Failed to delete task:", err);
      dispatch({ type: "ERROR", payload: err }); // 👈 Stop loading on error
    }
  };

  // Toggle task completion (for checkbox persistence)
  const toggleTaskCompletion = async (id, completed) => {
    dispatch({ type: "LOADING" }); // 👈 Start loading

    try {
      const res = await updateTask(id, { completed });
      dispatch({
        type: "TOGGLE_COMPLETE",
        payload: { id, completed: res.data.completed },
      });

    } catch (err) {
      console.error("Failed to toggle completion:", err);
      dispatch({ type: "ERROR", payload: err }); // 👈 Stop loading on error
    }
  };

  // Get Tasks by Date
  const fetchTasksByDate = async (dateStr) => {
    dispatch({ type: "LOADING" }); // 👈 Start loading
    try {
      const res = await getTasksByDate(dateStr);
      dispatch({ type: "SET_TASKS", payload: res.data });

    } catch (err) {
      console.error("Failed to fetch tasks by date:", err);
      dispatch({ type: "ERROR", payload: err }); // 👈 Stop loading on error
    }
  }

  // Get Tasks by Range
  const fetchTasksByRange = async (start, end) => {
    dispatch({ type: "LOADING" }); // 👈 Start loading
    try {
      const res = await getTasksByRange(start, end);
      dispatch({ type: "SET_TASKS", payload: res.data });

    } catch (err) {
      console.error("Failed to fetch tasks by range:", err);
      dispatch({ type: "ERROR", payload: err }); // 👈 Stop loading on error
    }
  }

  // Get Recurring Tasks
  const fetchRecurringTasks = useCallback(async () => {
    dispatch({ type: "LOADING" }); // 👈 Start loading
    try {
      const res = await getRecurringTasks();
      dispatch({ type: "SET_RECURRING_TASKS", payload: res.data });
    } catch (err) {
      console.error("Failed to fetch recurring tasks:", err);
      dispatch({ type: "ERROR", payload: err }); // 👈 Stop loading on error
    }
  }, [dispatch]);

  return (
    <TaskContext.Provider
      value={{
        recurringTasks: state.recurringTasks,
        tasks: state.tasks,
        loading: state.loading,
        error: state.error,
        fetchTasksByDate,
        fetchTasksByRange,
        fetchRecurringTasks,
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