import axiosInstance from "./axiosInstance";

export const createGoal = (goalData) => {
  return axiosInstance.post("/goals/", goalData);
};

export const getGoals = () => {
  return axiosInstance.get("/goals/");
};

export const updateGoal = (goalId, updatedData) => {
  return axiosInstance.put(`/goals/${goalId}/`, updatedData);
};

export const deleteGoal = (goalId) => {
  return axiosInstance.delete(`/goals/${goalId}/`);
};