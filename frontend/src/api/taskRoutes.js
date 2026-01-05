import axiosInstance from "./axiosInstance";

// Tasks
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
  return axiosInstance.get("/tasks/?recurring=true/");
};

export const deleteTask = (taskId) => {
  return axiosInstance.delete(`/tasks/${taskId}/`);
};

export const updateTask = (taskId, updatedData) => {
  return axiosInstance.patch(`/tasks/${taskId}/`, updatedData);
};

// Instances
export const deleteInstance = (instanceId) => {
  return axiosInstance.patch(`/instances/${instanceId}/`, { is_deleted: true });
};

export const updateInstance = (id, data) => {
  return axiosInstance.patch(`/instances/${id}/`, data);
};

export const completeInstance = (parentId, date) => {
  return axiosInstance.post(`/tasks/${parentId}/complete/?date=${date}`);
};