import { ArrowUpRight } from "lucide-react";

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
}) {
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">

      {/* Header */}
      <div className="mb-4 flex items-start justify-between">

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {title}
          </p>
        </div>

        {Icon && (
          <div
            className="flex h-11 w-11 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105"
            style={{
              backgroundColor: "var(--color-primary-light)",
            }}
          >
            <Icon
              size={20}
              style={{
                color: "var(--color-primary)",
              }}
            />
          </div>
        )}
      </div>

      {/* Value */}

      <h2 className="mb-2 text-4xl font-bold leading-none text-slate-900">
        {value}
      </h2>

      {/* Footer */}

      <div className="flex items-center justify-between">

        <p className="text-sm text-slate-500">
          {subtitle}
        </p>

        {trend && (
          <div
            className="flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold"
            style={{
              backgroundColor: "var(--color-primary-light)",
              color: "var(--color-primary)",
            }}
          >
            <ArrowUpRight size={13} />
            {trend}
          </div>
        )}

      </div>

    </div>
  );
}

export default StatCard;