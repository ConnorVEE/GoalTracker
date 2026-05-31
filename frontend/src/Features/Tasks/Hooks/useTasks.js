import { useContext } from "react";
import { TaskContext } from "../Contexts/TaskContext.jsx";

export const useTasks = () => useContext(TaskContext);