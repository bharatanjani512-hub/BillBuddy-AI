import api from "./api";

// Get current user's budget
export const getBudget = async () => {
  const response = await api.get("/budget/");
  return response.data;
};

// Get budget summary
export const getBudgetSummary = async () => {
  const response = await api.get("/budget/summary");
  return response.data;
};

// Create or Update budget
export const saveBudget = async (budgetData) => {
  const response = await api.post("/budget/", budgetData);
  return response.data;
};