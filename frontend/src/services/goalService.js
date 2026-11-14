import api from "./api";

export const fetchGoals = async () => {
  const response = await api.get("/goals/");
  return response.data;
};

export const createGoal = async (goalData) => {
  const response = await api.post("/goals/", goalData);
  return response.data;
};

export const updateGoal = async (goalId, goalData) => {
  const response = await api.put(`/goals/${goalId}`, goalData);
  return response.data;
};

export const deleteGoal = async (goalId) => {
  const response = await api.delete(`/goals/${goalId}`);
  return response.data;
};
