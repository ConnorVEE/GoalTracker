import { createContext, useReducer, useCallback } from "react";
import { getGoals, deleteGoal, updateGoal, createGoal } from "../../../api/goalRoutes.js";

const GoalContext = createContext();

const initialState = {
  goals: [],
  loading: false,
  error: null,
};

function goalReducer(state, action) {
    switch (action.type) {
        case "SET_GOALS":
            return {
                ...state,
                goals: action.payload,
                loading: false,
            };
        case "ADD_GOAL":
            return {
                ...state,
                goals: [...state.goals, action.payload],
                loading: false,
            };
        case "UPDATE_GOAL":
            const updated = action.payload;
            return {
                ...state,
                goals: state.goals.map(g => g.id === updated.id ? updated : g),
                loading: false,
            };
        case "DELETE_GOAL":
            const deletedId = action.payload;
            return {
                ...state,
                goals: state.goals.filter(g => g.id !== deletedId),
                loading: false,
            };
        case "LOADING":
            return {
                ...state,
                loading: true,
            };
        case "ERROR":
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
} 

const GoalProvider = ({ children }) => {
    const [state, dispatch] = useReducer(goalReducer, initialState);

    // Add a goal
    const addGoal = useCallback(async (payload) => {
        dispatch({ type: "LOADING"});

        try {
            const res = await createGoal(payload);
            dispatch({ type: "ADD_GOAL", payload: res.data })

        } catch (err) {
            console.error("Failed to create task:", err);
            dispatch({ type: "ERROR", payload: err });
        }

    }, [dispatch]);

    // Update a goal
    const editGoal = async (goal, updatedData) => {
        dispatch({ type: "LOADING" })

        try {
            const res = await updateGoal(goal.id, updatedData);
            dispatch({
                type: "UPDATE_GOAL",
                payload: res.data,
            });

        } catch (err) {
            dispatch({ type: "ERROR", payload: err });
            throw err;
        }
    }

    // Fetch goals
    const fetchGoals = useCallback(async () => {
        dispatch({ type: "LOADING" });

        try {
            const res = await getGoals();

            // Possible normalization step here if needed
            // Let's check the goal shape
            // console.log("Fetched goals:", res.data);

            dispatch({ type: "SET_GOALS", payload: res.data });
        } catch (err) {
            console.error("Failed to fetch goals:", err);
            dispatch({ type: "ERROR", payload: err });
        }
    }, [dispatch]);

    // Delete a goal
    const deleteGoalItem = useCallback(async (goal) => {
        dispatch({ type: "LOADING" });

        try {
            await deleteGoal(goal);
            dispatch({ type: "DELETE_GOAL", payload: goal });
        } catch (err) {
            console.error("Failed to delete goal:", err);
            dispatch({ type: "ERROR", payload: err });
        }
    }, [dispatch]);

    return (
        <GoalContext.Provider 
        value={{ 
            goals: state.goals,
            loading: state.loading,
            error: state.error,
            fetchGoals, 
            deleteGoalItem,
            editGoal,
            addGoal,
        }}
        >
            {children}
        </GoalContext.Provider>
    );
};

export { GoalContext, GoalProvider };