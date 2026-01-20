import { createInstance } from "../../api/taskRoutes";

// Checks if an instance is virtual or real and performs the proper API call
export async function ensureInstance(task) {
    if (task.type === "virtual") {
        // Call updateTask for single, regular tasks
        const res = await createInstance(task.meta.parent_id, task.meta.date);
        return res.data;
    } else if (task.type === "instance") {
        return task;
    }

    throw new Error("ensureInstance() given invalid task type!");
}