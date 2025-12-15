import { createContext, useReducer, useCallback } from "react";
import { 
    createTask,  
    getTasksByDate, 
    getTasksByRange, 
    getRecurringTasks, 
    updateTask, 
    deleteTask,
    completeInstance,
    updateInstance
} from "../api/taskRoutes"

const TaskContext = createContext();

const initialState = {
  tasks: [],
  recurringTasks: [],
  currentRange: { start: null, end: null },
  loading: false,
  error: null,
};

// normalize a server item for frontend consumption
function normalizeTask(item) {
  if (item.type === "single") {
    return {
      id: item.id,
      parent_id: null,
      title: item.title,
      date: item.date,
      completed: item.completed,
      isInstance: false,
      type: "single",
    };
  }

  if (item.type === "instance") {
    return {
      id: item.id,
      parent_id: item.parent_id,
      title: item.title || item.parent_title,
      date: item.date,
      completed: item.completed,
      type: "instance",
      isInstance: true,
      isVirtual: false,
      persisted: true,
      meta: null
    };
  }

  if (item.type === "parent") {
    return {
      id: item.id,
      parent_id: null,
      title: item.title,
      recurrence_rule: item.recurrence_rule, // keep this for reference
      completed: item.completed,
      type: "parent",
      isTemplate: true, // helpful for UI filtering
    };
  }

  console.warn("⚠️ normalizeTask encountered unknown type:", item);
  return null;
}

function taskReducer(state, action) {
  switch (action.type) {
    case "SET_RANGE":
      return { ...state, currentRange: action.payload };
    case "SET_TASKS": 
      const incoming = action.payload;

      if (!state.currentRange?.start || !state.currentRange?.end) {
        return {
          ...state,
          tasks: incoming.filter(t => t.type !== "parent"),
          loading: false,
        };
      }

      const parents =
        incoming.filter(t => t.type === "parent").length > 0
          ? incoming.filter(t => t.type === "parent")
          : state.recurringTasks;

      const realTasks = incoming.filter(t => t.type !== "parent");

      const virtualTasks = generateVirtualInstances(
        parents,
        state.currentRange?.start,
        state.currentRange?.end
      );

      const realKeys = new Set(
        realTasks
          .filter(t => t.type === "instance")
          .map(t => `${t.parent_id}-${t.date}`)
      );

      const filteredVirtuals = virtualTasks.filter(
        v => !realKeys.has(`${v.parent_id}-${v.date}`)
      );

      return {
        ...state,
        tasks: [...realTasks, ...filteredVirtuals],
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
        if (t.isVirtual && t.meta?.parent_id === updated.parent_id && t.meta?.date === updated.date) {
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
      return { ...state, loading: true, tasks: [], error: null };
    case "ERROR":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

// Utility: generate virtual instances for all recurring parents
function generateVirtualInstances(parents, startDate, endDate) {
  const virtuals = [];

  const start = new Date(startDate);
  const end = new Date(endDate);

  // Walk day by day through the range
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const weekday = d.getDay();
    const dateStr = d.toISOString().split("T")[0];

    parents.forEach(parent => {
      const days = parent.recurrence_rule?.days_of_week || [];

      // Recurrence match
      if (days.includes(weekday)) {
        virtuals.push({
          type: "instance",
          parent_id: parent.id,
          date: dateStr,
          title: parent.title,
          completed: false,
          isVirtual: true,
          id: `virtual-${parent.id}-${dateStr}`,
          meta: {
            parent_id: parent.id,
            date: dateStr
          }
        });
      }
    });
  }

  return virtuals;
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
  const editTask = async (id, updatedData) => {
    dispatch({ type: "LOADING" }); // 👈 Start loading
    try {
      const res = await updateTask(id, updatedData);
      const normalized = normalizeTask(res.data);
      dispatch({ type: "UPDATE_TASK", payload: normalized });
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
    } catch (err) {
      console.error("Failed to delete task:", err);
      dispatch({ type: "ERROR", payload: err }); // 👈 Stop loading on error
    }
  };

// Toggle task completion (for checkbox persistence)
const toggleTaskCompletion = async (task, completed) => {
  console.log("🟦 toggleTaskCompletion called");
  console.log("• incoming task:", task);
  console.log("• completed value:", completed);
  console.log("• type:", task?.type);
  console.log("• isVirtual:", task?.isVirtual);
  console.log("• meta:", task?.meta);

  dispatch({ type: "LOADING" });

  try {
    let res;
    let normalized;

    // --- Branch 1: Single tasks -------------------------
    if (task.type === "single") {
      console.log("➡️ Branch: SINGLE");
      res = await updateTask(task.id, { completed });
      normalized = normalizeTask({ ...res.data, type: "single" });
    }

    // --- Branch 2: Virtual instances --------------------
    else if (task.type === "instance" && task.isVirtual && task.meta) {
      console.log("➡️ Branch: VIRTUAL INSTANCE");
      console.log("• parent_id:", task.meta.parent_id);
      console.log("• date:", task.meta.date);

      res = await completeInstance(task.meta.parent_id, task.meta.date);
      console.log("• backend response:", res.data);

      normalized = normalizeTask({
        ...res.data,
        type: "instance",
        isVirtual: false,
      });
    }

    // --- Branch 3: Real instances -----------------------
    else if (task.type === "instance" && !task.isVirtual) {
      console.log("➡️ Branch: REAL INSTANCE");
      console.log("• real instance id:", task.id);

      res = await updateInstance(task.id, { completed });
      console.log("• backend response:", res.data);

      normalized = normalizeTask({
        ...res.data,
        type: "instance",
        isVirtual: false,
      });
    }

    // Safety catch: none of the branches matched
    else {
      console.log("❌ No toggle branch matched this task!");
      console.log("Task object:", task);
      throw new Error("No toggle branch matched task (unexpected type).");
    }

    console.log("📥 Dispatching UPDATE_TASK with:", normalized);
    dispatch({ type: "UPDATE_TASK", payload: normalized });

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
  dispatch({ type: "SET_RANGE", payload: { start: dateStr, end: dateStr }});

  try {
    const res = await getTasksByDate(dateStr);
    const normalized = res.data.map(normalizeTask);

    dispatch({ type: "SET_TASKS", payload: normalized });

  } catch (err) {
    console.error("Failed to fetch tasks by date:", err);
    dispatch({ type: "ERROR", payload: err });
  }
};

// Get Tasks by Range
const fetchTasksByRange = useCallback(
  async (start, end) => {
    dispatch({ type: "LOADING" });
    dispatch({ type: "SET_RANGE", payload: { start, end }});

    try {
      const res = await getTasksByRange(start, end);
      const normalized = res.data.map(normalizeTask);

      dispatch({ type: "SET_TASKS", payload: normalized });

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
        currentRange: state.currentRange,
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