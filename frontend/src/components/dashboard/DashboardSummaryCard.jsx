import {
  IndianRupee,
  Wallet,
  Target,
  Receipt,
  ArrowUpRight,
} from "lucide-react";

const iconMap = {
  expense: IndianRupee,
  budget: Wallet,
  goal: Target,
  bill: Receipt,
};

const colorMap = {
  red: {
    bg: "bg-red-50",
    icon: "text-red-600",
  },
  blue: {
    bg: "bg-blue-50",
    icon: "text-blue-600",
  },
  green: {
    bg: "bg-emerald-50",
    icon: "text-emerald-600",
  },
  amber: {
    bg: "bg-amber-50",
    icon: "text-amber-600",
  },
};

function DashboardSummaryCard({
  title,
  value,
  subtitle,
  icon,
  color = "blue",
}) {
  const Icon = iconMap[icon];
  const theme = colorMap[color];

  return (
    <div className="group rounded-3xl border border-stone-200 bg-[#FEFDFB] p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-800">
            {value}
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            {subtitle}
          </p>
        </div>

        <div
          className={`flex h-14 w-14 items-center justify-center rounded-2xl ${theme.bg}`}
        >
          <Icon className={`h-7 w-7 ${theme.icon}`} />
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-stone-100 pt-4">
        <span className="text-xs font-medium text-slate-400">
          Updated just now
        </span>

        <ArrowUpRight className="h-5 w-5 text-slate-400 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
      </div>
    </div>
  );
}

export default DashboardSummaryCard;