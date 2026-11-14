import api from "./api";

// ==============================
// Get All Budgets (paginated)
// ==============================
export const fetchBudgets = async (params = {}) => {
  const response = await api.get("/budget/", {
    params,
  });
  // Handles both response.data.data and response.data
  return response.data?.data || response.data;
};

// ==============================
// Get Budget Statistics
// ==============================
export const fetchBudgetStatistics = async () => {
  const response = await api.get("/budget/statistics");
  return response.data?.data || response.data;
};

// ==============================
// Get Budget Summary
// ==============================
export const fetchBudgetSummary = async () => {
  const response = await api.get("/budget/summary");
  return response.data?.data || response.data;
};

// ==============================
// Create Budget
// ==============================
export const createBudget = async (budgetData) => {
  const response = await api.post("/budget/create", budgetData);
  return response.data;
};

// ==============================
// Update Budget
// ==============================
export const updateBudget = async (budgetId, budgetData) => {
  const response = await api.put(`/budget/${budgetId}`, budgetData);
  return response.data;
};

// ==============================
// Delete Budget
// ==============================
export const deleteBudget = async (budgetId) => {
  const response = await api.delete(`/budget/${budgetId}`);
  return response.data;
};

// ==============================
// Get Recent Budgets
// ==============================
export const fetchRecentBudgets = async () => {
  const response = await api.get("/budget/recent");
  return response.data?.data || response.data;
};
