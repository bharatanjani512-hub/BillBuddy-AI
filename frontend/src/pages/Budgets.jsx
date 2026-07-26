import { useEffect, useState } from "react";
import {
  saveBudget,
  getBudgetSummary,
} from "../api/budget";

function Budgets() {
  const [budget, setBudget] = useState("");

  const [summary, setSummary] = useState({
    monthly_budget: 0,
    spent_this_month: 0,
    remaining_budget: 0,
    status: "Excellent",
    currency: "INR",
  });

  const loadBudgetSummary = async () => {
    try {
      const data = await getBudgetSummary();
      setSummary(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadBudgetSummary();
  }, []);

  const handleSaveBudget = async () => {
    if (!budget) {
      alert("Please enter a monthly budget.");
      return;
    }

    try {
      await saveBudget({
        monthly_budget: Number(budget),
      });

      alert("Monthly budget saved successfully!");

      setBudget("");

      // Refresh summary cards
      await loadBudgetSummary();

    } catch (error) {
      console.error(error);
      alert("Failed to save budget.");
    }
  };

  return (
    <div className="min-h-screen bg-[#050816] p-8 text-white">
      <h1 className="mb-8 text-4xl font-bold">
        Monthly Budget
      </h1>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-4">

        <div className="rounded-2xl bg-slate-900 p-6">
          <p className="text-gray-400">
            Monthly Budget
          </p>
          <h2 className="mt-2 text-3xl font-bold">
            ₹{summary.monthly_budget}
          </h2>
        </div>

        <div className="rounded-2xl bg-slate-900 p-6">
          <p className="text-gray-400">
            Spent This Month
          </p>
          <h2 className="mt-2 text-3xl font-bold">
            ₹{summary.spent_this_month}
          </h2>
        </div>

        <div className="rounded-2xl bg-slate-900 p-6">
          <p className="text-gray-400">
            Remaining Budget
          </p>
          <h2 className="mt-2 text-3xl font-bold">
            ₹{summary.remaining_budget}
          </h2>
        </div>

        <div className="rounded-2xl bg-slate-900 p-6">
          <p className="text-gray-400">
            Status
          </p>
          <h2 className="mt-2 text-3xl font-bold text-green-400">
            {summary.status}
          </h2>
        </div>

      </div>

      {/* Budget Form */}
      <div className="mt-10 rounded-2xl bg-slate-900 p-8">

        <h2 className="mb-6 text-2xl font-semibold">
          Set Monthly Budget
        </h2>

        <input
          type="number"
          placeholder="Enter Monthly Budget"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-violet-500"
        />

        <button
          onClick={handleSaveBudget}
          className="mt-6 rounded-xl bg-violet-600 px-8 py-3 font-semibold transition hover:bg-violet-700"
        >
          Save Budget
        </button>

      </div>
    </div>
  );
}

export default Budgets;