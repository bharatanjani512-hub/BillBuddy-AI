import { useEffect, useState } from "react";

import DashboardStats from "../components/dashboard/DashboardStats";
import ExpenseTrendChart from "../components/dashboard/ExpenseTrendChart";
import RecentTransactions from "../components/dashboard/RecentTransactions";
import AIInsightsCard from "../components/dashboard/AIInsightsCard";
import PageHeader from "../components/shared/PageHeader";

import { getDashboardSummary } from "../api/dashboard";
import { getFinancialInsights } from "../api/insights";

function Dashboard() {
  const [dashboard, setDashboard] = useState({
    total_transactions: 0,
    total_expense: 0,
    monthly_budget: 0,
    savings_goal: 0,
    pending_bills: 0,
    ai_insights: 0,
  });

  // AI Insights State
  const [aiInsights, setAiInsights] = useState({
    summary: "",
    good_habits: [],
    risky_habits: [],
    recommendations: [],
  });

  const [loadingInsights, setLoadingInsights] = useState(true);
  const [insightError, setInsightError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await getDashboardSummary();

        setDashboard((prev) => ({
          ...prev,
          ...data,
        }));
      } catch (error) {
        console.error("Dashboard Error:", error);
      }
    };

    const fetchInsights = async () => {
      try {
        setLoadingInsights(true);

        const data = await getFinancialInsights();

        if (data.ai_insights) {
          setAiInsights(data.ai_insights);
        } else {
          setAiInsights({
            summary: "",
            good_habits: [],
            risky_habits: [],
            recommendations: [],
          });
        }

        setInsightError(null);
      } catch (error) {
        console.error("AI Insights Error:", error);

        setInsightError(
          "Unable to load AI insights."
        );
      } finally {
        setLoadingInsights(false);
      }
    };

    fetchDashboard();
    fetchInsights();
  }, []);

  return (
    <div className="space-y-5">
      <PageHeader
        badge="WELCOME BACK 👋"
        title="Dashboard"
        description="Your financial overview at a glance."
      />

      <DashboardStats dashboard={dashboard} />

      {/* Expense Trend + AI Insights */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3 xl:items-stretch">
        {/* Expense Trend */}
        <section className="h-[430px] xl:col-span-2">
          <ExpenseTrendChart />
        </section>

        {/* AI Insights */}
        <section className="h-[430px]">
          <AIInsightsCard
            loading={loadingInsights}
            error={insightError}
            insights={aiInsights}
          />
        </section>
      </div>

      {/* Recent Transactions */}
      <section>
        <RecentTransactions />
      </section>
    </div>
  );
}

export default Dashboard;