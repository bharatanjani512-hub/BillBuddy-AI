import api from "./api";

// ==========================
// AI Financial Insights
// ==========================
export const getFinancialInsights = async () => {
  const response = await api.get("/insights");

  return response.data;
};