import { useContext } from "react";
import { TaskContext } from "./TaskContext";

export const useTasks = () => useContext(TaskContext);