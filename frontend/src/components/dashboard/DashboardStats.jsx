import {
  Receipt,
  IndianRupee,
  Wallet,
  PiggyBank,
  Clock3,
  Sparkles,
} from "lucide-react";

import StatCard from "../cards/StatCard";

function DashboardStats({ dashboard }) {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      <StatCard
        title="Total Bills"
        value={dashboard.total_transactions}
        subtitle="Bills Created"
        icon={Receipt}
      />

      <StatCard
        title="Total Expense"
        value={`₹${dashboard.total_expense.toLocaleString("en-IN")}`}
        subtitle="Spent This Month"
        icon={IndianRupee}
      />

      <StatCard
        title="Monthly Budget"
        value={`₹${dashboard.monthly_budget.toLocaleString("en-IN")}`}
        subtitle="Budget Limit"
        icon={Wallet}
      />

      <StatCard
        title="Savings Goal"
        value={`₹${dashboard.savings_goal.toLocaleString("en-IN")}`}
        subtitle="Current Progress"
        icon={PiggyBank}
      />

      <StatCard
        title="Bills Due"
        value={dashboard.pending_bills}
        subtitle="Pending Bills"
        icon={Clock3}
      />

      <StatCard
        title="AI Insights"
        value={dashboard.ai_insights}
        subtitle="Recommendations"
        icon={Sparkles}
      />
    </div>
  );
}

export default DashboardStats;