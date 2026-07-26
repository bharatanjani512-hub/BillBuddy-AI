import {
  LayoutDashboard,
  Receipt,
  Wallet,
  Target,
  Sparkles,
  Settings,
  ChevronDown,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const menuItems = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Bills",
    path: "/bills",
    icon: Receipt,
  },
  {
    name: "Budgets",
    path: "/budgets",
    icon: Wallet,
  },
  {
    name: "Goals",
    path: "/goals",
    icon: Target,
  },
  {
    name: "AI Insights",
    path: "/insights",
    icon: Sparkles,
  },
  {
    name: "Settings",
    path: "/settings",
    icon: Settings,
  },
];

function Sidebar() {
  return (
    <aside className="flex h-screen w-72 flex-col border-r border-slate-800 bg-slate-900 px-6 py-8">
      {/* Logo */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          BillBuddy AI
        </h1>

        <p className="mt-1 text-sm text-slate-400">
          Smart Personal Finance
        </p>
      </div>

      {/* Navigation */}
      <nav className="mt-10 flex-1">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-[var(--color-primary)] text-white shadow-md"
                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                    }`
                  }
                >
                  <Icon
                    size={20}
                    className="transition-transform group-hover:scale-105"
                  />
                  <span>{item.name}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile */}
      <div className="border-t border-slate-800 pt-6">
        <button className="flex w-full items-center justify-between rounded-xl p-3 transition hover:bg-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-primary)] text-lg font-semibold text-white">
              B
            </div>

            <div className="text-left">
              <p className="font-medium text-white">
                BillBuddy User
              </p>

              <p className="text-xs text-slate-400">
                Welcome back 👋
              </p>
            </div>
          </div>

          <ChevronDown
            size={18}
            className="text-slate-500"
          />
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;