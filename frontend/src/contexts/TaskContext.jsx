import { createContext, useReducer, useCallback } from "react";
import { 
    createTask,  
    getTasksByDate, 
    getTasksByRange, 
    getRecurringTasks, 
    updateTask, 
    deleteTask,
    deleteInstance,
    updateInstance,
} from "../api/taskRoutes"
// Utilities
import { buildVisibleTasksByRange, normalizeTask } from "../utils/tasks/TaskGenUtils";
import { ensureInstance } from "../utils/tasks/InstanceUtils";

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
      return {
        ...state,
        tasks: action.payload,
        loading: false,
      };
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
      const updated = action.payload;

      const filtered = state.tasks.filter(t => {
        // Remove any virtual matching this newly created real instance
        if (t.type === "virtual" && t.meta?.parent_id === updated.parent_id && t.meta?.date === updated.date) {
          return false;
        }

        // Remove duplicate real versions
        if (t.id === updated.id) {
          return false;
        }

        return true;
      });

      return {
        ...state,
        tasks: [...filtered, updated],
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
      return { ...state, loading: true, error: null };
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
      const normalized = normalizeTask(res.data);
      dispatch({ type: "ADD_TASK", payload: normalized });

    } catch (err) {
      console.error("Failed to create task:", err);
      dispatch({ type: "ERROR", payload: err }); // 👈 Stop loading on error
      
    }
  };

  // Update a task
  const editTask = async (task, updatedData) => {
    dispatch({ type: "LOADING" });

    try {
      let res;

      if (task.type === "single") {
        res = await updateTask(task.id, updatedData);

      } else {
        const instance = await ensureInstance(task);
        res = await updateInstance(instance.id, updatedData);
      }

      dispatch({
        type: "UPDATE_TASK",
        payload: normalizeTask(res.data),
      });

    } catch (err) {
      dispatch({ type: "ERROR", payload: err });
    }
  };

  // Delete a task
  const deleteTaskItem = async (task) => {
    dispatch({ type: "LOADING" });

    try {
      let deletedId;

      if (task.type === "single") {
        await deleteTask(task.id);
        deletedId = task.id;
      } else {
        const instance = await ensureInstance(task);
        await deleteInstance(instance.id);
        deletedId = instance.id;
      }

      dispatch({
        type: "DELETE_TASK",
        payload: deletedId,
      });

    } catch (err) {
      dispatch({ type: "ERROR", payload: err });
    }
  };

  // Toggle task completion (for checkbox persistence)
  const toggleTaskCompletion = async (task, completed) => {
    dispatch({ type: "LOADING" });

    try {
      let res;

      if (task.type === "single") {
        res = await updateTask(task.id, { completed });
      } else {
        const instance = await ensureInstance(task);
        // log full new instance object to see what it contains
        console.log("INSTANCE", instance);
        res = await updateInstance(instance.id, { completed });
      } 

      dispatch ({ type: "UPDATE_TASK", payload: normalizeTask(res.data) });

    } catch (err) {
      console.error(
        "❌ Failed to toggle completion:",
        err.response?.data || err.message
      );
      dispatch({ type: "ERROR", payload: err });
    }

  };

  // Get Tasks by Date
  const fetchTasksByDate = async (dateStr) => {
    dispatch({ type: "LOADING" });

    try {
      const res = await getTasksByDate(dateStr);
      const normalized = res.data.map(normalizeTask);

      // console.group("📡 FETCH TASKS");
      // console.log("RAW", res.data);
      // console.log("NORMALIZED", normalized);

      // Generate virtual instances and filter tasks out, given the range:
      const visibleTasks = buildVisibleTasksByRange(normalized, dateStr, dateStr);

      // console.log("VISIBLE", visibleTasks);
      // console.groupEnd();

      dispatch({ type: "SET_TASKS", payload: visibleTasks });

    } catch (err) {
      console.error("Failed to fetch tasks by date:", err);
      dispatch({ type: "ERROR", payload: err });
    }
  };

  // Get Tasks by Range
  const fetchTasksByRange = useCallback(
    async (start, end) => {
      dispatch({ type: "LOADING" });

      try {
        const res = await getTasksByRange(start, end);
        const normalized = res.data.map(normalizeTask);

        // Generate virtual instances and filter tasks out, given the range:
        const visibleTasks = buildVisibleTasksByRange(normalized, start, end);

        dispatch({ type: "SET_TASKS", payload: visibleTasks });

      } catch (err) {
        console.error("Failed to fetch tasks by range:", err);
        dispatch({ type: "ERROR", payload: err });
      }
    },
    []
  );

  // Get Recurring Tasks
  const fetchRecurringTasks = useCallback(async () => {
    dispatch({ type: "LOADING" }); // 👈 Start loading

    try {
      const res = await getRecurringTasks();
      const normalized = res.data.map(normalizeTask);

      // Parent tasks only
      dispatch({ type: "SET_RECURRING_TASKS", payload: normalized.filter(t => t.type === "parent") });
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
        deleteTaskItem,
        toggleTaskCompletion,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export { TaskContext };