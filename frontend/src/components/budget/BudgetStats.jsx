import {
  Wallet,
  TrendingUp,
  IndianRupee,
  BarChart3,
} from "lucide-react";

const cards = [
  {
    title: "Total Budgets",
    key: "total_budgets",
    icon: Wallet,
  },
  {
    title: "Total Budget",
    key: "total_budget",
    icon: IndianRupee,
  },
  {
    title: "Highest Budget",
    key: "highest_budget",
    icon: TrendingUp,
  },
  {
    title: "Average Budget",
    key: "average_budget",
    icon: BarChart3,
  },
];

const BudgetStats = ({ statistics }) => {
  return (
    <div className="mb-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.key}
            className="rounded-2xl bg-white p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500">
                  {card.title}
                </p>

                <h2 className="mt-3 text-4xl font-bold text-slate-800">
                  {card.key === "total_budgets"
                    ? statistics?.[card.key] ?? 0
                    : `₹${statistics?.[card.key] ?? 0}`}
                </h2>
              </div>

              <div className="rounded-xl bg-blue-50 p-4">
                <Icon
                  className="text-blue-600"
                  size={28}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BudgetStats;