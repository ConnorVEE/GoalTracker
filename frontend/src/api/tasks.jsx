import axiosInstance from "./axiosInstance";

export const createTask = (taskData) => {
  return axiosInstance.post("/tasks/", taskData);
};

export const getTasks = () => {
  return axiosInstance.get("/tasks/");
};

export const updateTask = (taskId, updatedData) => {
  return axiosInstance.put(`/tasks/${taskId}/`, updatedData);
};

export const deleteTask = (taskId) => {
  return axiosInstance.delete(`/tasks/${taskId}/`);
};