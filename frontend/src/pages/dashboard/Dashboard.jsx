import { useEffect, useState } from "react";
import DashboardSidebar from "../../components/dashboard/DashboardSidebar";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import DashboardSummaryCard from "../../components/dashboard/DashboardSummaryCard";
import ExpenseChart from "../../components/dashboard/ExpenseChart";
import CategoryChart from "../../components/dashboard/CategoryChart";
import RecentTransactions from "../../components/dashboard/RecentTransactions";
import {
  fetchDashboardSummary,
  fetchRecentTransactions,
  fetchUpcomingBills,
} from "../../services/dashboardService";

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function isOverdue(dateStr) {
  if (!dateStr) return false;
  return new Date(dateStr) < new Date(new Date().toDateString());
}

function Dashboard() {
  const [summary, setSummary] = useState({
    total_transactions: 0,
    total_expense: 0,
    monthly_budget: 0,
    savings_goal: 0,
  });
  const [transactions, setTransactions] = useState([]);
  const [upcomingBills, setUpcomingBills] = useState([]);
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [loadingTransactions, setLoadingTransactions] = useState(true);
  const [loadingBills, setLoadingBills] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    await Promise.all([
      loadSummary(),
      loadRecentTransactions(),
      loadUpcomingBills(),
    ]);
  };

  const loadSummary = async () => {
    try {
      const response = await fetchDashboardSummary();
      console.log("Dashboard Summary:", response);
      setSummary(response);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingSummary(false);
    }
  };

  const loadRecentTransactions = async () => {
    try {
      const response = await fetchRecentTransactions();
      console.log("Recent Transactions:", response);
      setTransactions(response);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingTransactions(false);
    }
  };

  const loadUpcomingBills = async () => {
    try {
      const response = await fetchUpcomingBills();
      setUpcomingBills(response?.payload || []);
    } catch (error) {
      console.error("Upcoming bills error:", error);
    } finally {
      setLoadingBills(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#F4F6F2]">
      <DashboardSidebar />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 min-w-0">
        <DashboardHeader />

        {/* Financial Summary */}
        <section className="mt-8 rounded-2xl border border-[#E0E6DC] bg-white p-6 sm:p-8 shadow-xs">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800">
              Financial Summary
            </h2>
            <p className="mt-1 text-slate-500">
              A quick snapshot of your financial health.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <DashboardSummaryCard
              title="Total Expenses"
              value={
                loadingSummary
                  ? "Loading..."
                  : `₹${summary.total_expense.toLocaleString("en-IN")}`
              }
              subtitle={`${summary.total_transactions} Transactions`}
              icon="expense"
              color="red"
            />
            <DashboardSummaryCard
              title="Monthly Budget"
              value={
                loadingSummary
                  ? "Loading..."
                  : `₹${summary.monthly_budget.toLocaleString("en-IN")}`
              }
              subtitle="Current Budget"
              icon="budget"
              color="blue"
            />
            <DashboardSummaryCard
              title="Savings Goal"
              value={
                loadingSummary
                  ? "Loading..."
                  : `₹${summary.savings_goal.toLocaleString("en-IN")}`
              }
              subtitle={
                summary.savings_goal > 0
                  ? "Your Financial Target"
                  : "No Goal Created"
              }
              icon="goal"
              color="green"
            />
            <DashboardSummaryCard
              title="Transactions"
              value={
                loadingSummary
                  ? "Loading..."
                  : summary.total_transactions.toString()
              }
              subtitle="Bills Recorded"
              icon="bill"
              color="amber"
            />
          </div>
        </section>

        {/* Analytics */}
        <section className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="col-span-2 rounded-3xl border border-stone-200 bg-[#FEFDFB] p-8 shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-800">
                Expense Trend
              </h2>
              <p className="mt-1 text-slate-500">
                Monthly spending analysis
              </p>
            </div>
            <ExpenseChart />
          </div>
          <div className="rounded-3xl border border-stone-200 bg-[#FEFDFB] p-8 shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-800">
                Spending by Category
              </h2>
              <p className="mt-1 text-slate-500">
                Category wise expense distribution
              </p>
            </div>
            <CategoryChart />
          </div>
        </section>

        {/* Recent Transactions */}
        <section className="mt-8 rounded-3xl border border-stone-200 bg-[#FEFDFB] p-8 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-800">
                Recent Transactions
              </h2>
              <p className="mt-1 text-slate-500">
                Your latest expenses and bill history.
              </p>
            </div>
            <button className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100">
              View All
            </button>
          </div>
          <RecentTransactions
            transactions={transactions}
            loading={loadingTransactions}
          />
        </section>

        {/* Upcoming Bills */}
        <section className="mt-8 rounded-3xl border border-stone-200 bg-[#FEFDFB] p-8 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-800">
                Upcoming Bills
              </h2>
              <p className="mt-1 text-slate-500">
                Bills due soon that require your attention.
              </p>
            </div>
          </div>

          {loadingBills ? (
            <p className="text-sm text-slate-400">Loading upcoming bills…</p>
          ) : upcomingBills.length === 0 ? (
            <p className="text-sm text-slate-400">
              No upcoming bills. You&apos;re all caught up! 🎉
            </p>
          ) : (
            <ul className="divide-y divide-stone-100">
              {upcomingBills.map((bill) => {
                const overdue = isOverdue(bill.due_date);
                return (
                  <li
                    key={bill._id}
                    className="flex items-center justify-between py-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 text-xs font-bold uppercase">
                        {(bill.category || "?")[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">
                          {bill.title}
                        </p>
                        <p className="text-xs text-slate-500">
                          {bill.merchant || bill.category || ""}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-slate-800">
                        ₹{(bill.amount || 0).toLocaleString("en-IN")}
                      </p>
                      <p
                        className={`text-xs font-medium ${
                          overdue
                            ? "text-red-500"
                            : "text-orange-500"
                        }`}
                      >
                        {overdue ? "Overdue · " : "Due · "}
                        {formatDate(bill.due_date)}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
