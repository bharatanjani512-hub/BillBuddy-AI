import api from "./api";

export const dashboardService = {
  async getSummary() {
    const response = await api.get("/dashboard/summary");
    return response.data;
  },

  async getMonthlyExpenses() {
    const response = await api.get("/dashboard/monthly");
    return response.data;
  },

  async getCategoryExpenses() {
    const response = await api.get("/dashboard/category");
    return response.data;
  },

  async getAIInsights() {
    const response = await api.get("/insights/");
    return response.data;
  },
};