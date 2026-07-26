import api from "./api";

// ==========================
// Dashboard Summary
// ==========================
export const getDashboardSummary = async () => {
  const response = await api.get("/dashboard/summary");
  return response.data;
};

// ==========================
// Recent Transactions
// ==========================
export const getRecentTransactions = async () => {
  const response = await api.get("/bills/recent");
  return response.data;
};