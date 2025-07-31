import axiosInstance from "./axiosInstance";

export const createTask = (taskData) => {
  return axiosInstance.post("/tasks/", taskData);
};

export const getTasks = () => {
  return axiosInstance.get("/tasks/");
};

export const getTasksByDate = (dateStr) => {
  return axiosInstance.get(`/tasks/?date=${dateStr}`);
};

export const getTasksByRange = (start, end) => { 
  return axiosInstance.get("/tasks/", {
    params: { start, end },
  });
};

export const getRecurringTasks = () => {
  return axiosInstance.get("/tasks/?recurring=true");
};

export const updateTask = (taskId, updatedData) => {
  return axiosInstance.put(`/tasks/${taskId}/`, updatedData);
};

export const deleteTask = (taskId) => {
  return axiosInstance.delete(`/tasks/${taskId}/`);
};