function BudgetOverviewCard({
  monthlyBudget = 0,
  spentThisMonth = 0,
  remainingBudget = 0,
  usagePercentage = 0,
  status = "Excellent",
  currency = "INR",
}) {
  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);

  const getStatusStyle = () => {
    switch (status) {
      case "Excellent":
        return {
          bg: "bg-emerald-100",
          text: "text-emerald-700",
          progress: "bg-emerald-500",
        };

      case "Safe":
        return {
          bg: "bg-blue-100",
          text: "text-blue-700",
          progress: "bg-blue-500",
        };

      case "Warning":
        return {
          bg: "bg-yellow-100",
          text: "text-yellow-700",
          progress: "bg-yellow-500",
        };

      default:
        return {
          bg: "bg-red-100",
          text: "text-red-700",
          progress: "bg-red-500",
        };
    }
  };

  const style = getStatusStyle();

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg">

      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Monthly Budget
          </p>

          <h2 className="mt-2 text-3xl font-bold text-slate-900">
            {formatCurrency(monthlyBudget)}
          </h2>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-sm font-semibold ${style.bg} ${style.text}`}
        >
          {status}
        </span>
      </div>

      <div className="mb-3 h-3 overflow-hidden rounded-full bg-slate-200">
        <div
          className={`h-full rounded-full ${style.progress} transition-all duration-500`}
          style={{
            width: `${Math.min(usagePercentage, 100)}%`,
          }}
        />
      </div>

      <p className="mb-6 text-sm text-slate-500">
        {usagePercentage.toFixed(0)}% of your monthly budget used
      </p>

      <div className="grid grid-cols-2 gap-5">

        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-sm text-slate-500">
            Spent
          </p>

          <h3 className="mt-2 text-xl font-bold text-slate-900">
            {formatCurrency(spentThisMonth)}
          </h3>
        </div>

        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-sm text-slate-500">
            Remaining
          </p>

          <h3 className="mt-2 text-xl font-bold text-slate-900">
            {formatCurrency(remainingBudget)}
          </h3>
        </div>

      </div>

    </div>
  );
}

export default BudgetOverviewCard;