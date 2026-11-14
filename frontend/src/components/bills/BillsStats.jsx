import {
  ReceiptIndianRupee,
  CheckCircle2,
  Clock,
  TrendingUp,
} from "lucide-react";

const BillsStats = ({ statistics = {} }) => {
  const totalBills = statistics.total_bills ?? 0;
  const totalExpense = statistics.total_expense ?? 0;
  const totalPaid = statistics.total_paid ?? totalExpense;
  const totalPending = statistics.total_pending ?? 0;
  const pendingCount = statistics.pending_count ?? 0;
  const paidCount = statistics.paid_count ?? totalBills;

  const cards = [
    {
      title: "Total Bills Tracked",
      value: totalBills,
      subtitle: `${paidCount} paid, ${pendingCount} pending`,
      icon: ReceiptIndianRupee,
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Total Paid",
      value: `₹${Number(totalPaid).toLocaleString("en-IN")}`,
      subtitle: "Cleared business & personal bills",
      icon: CheckCircle2,
      bgColor: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      title: "Pending / Need to Pay",
      value: `₹${Number(totalPending).toLocaleString("en-IN")}`,
      subtitle: `${pendingCount} bill(s) awaiting payment`,
      icon: Clock,
      bgColor: "bg-amber-50",
      iconColor: "text-amber-600",
    },
    {
      title: "Total Expense Volume",
      value: `₹${Number(totalExpense).toLocaleString("en-IN")}`,
      subtitle: `Highest: ₹${Number(statistics.highest_expense ?? 0).toLocaleString("en-IN")}`,
      icon: TrendingUp,
      bgColor: "bg-violet-50",
      iconColor: "text-violet-600",
    },
  ];

  return (
    <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="rounded-3xl border border-stone-200 bg-[#FEFDFB] p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  {card.title}
                </p>

                <h2 className="mt-2 text-2xl font-extrabold text-slate-800">
                  {card.value}
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  {card.subtitle}
                </p>
              </div>

              <div className={`rounded-2xl ${card.bgColor} p-3.5`}>
                <Icon
                  size={24}
                  className={card.iconColor}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BillsStats;
