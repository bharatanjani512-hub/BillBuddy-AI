import api from "./api";

export const budgetService = {
  async getBudget() {
    const response = await api.get("/users/budget");
    return response.data;
  },

  async updateBudget(monthlyBudget) {
    const response = await api.patch("/users/budget", {
      monthly_budget: monthlyBudget,
    });

    return response.data;
  },
};