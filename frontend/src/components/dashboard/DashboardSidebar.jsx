import {
  LayoutDashboard,
  Receipt,
  Wallet,
  Target,
  Sparkles,
  MessageCircle,
  Settings,
  LogOut,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const menuItems = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    name: "Bills & Scanner",
    icon: Receipt,
    path: "/bills",
  },
  {
    name: "Budget",
    icon: Wallet,
    path: "/budget",
  },
  {
    name: "Goals",
    icon: Target,
    path: "/goals",
  },
  {
    name: "AI Insights",
    icon: Sparkles,
    path: "/ai-insights",
  },
  {
    name: "AI Assistant",
    icon: MessageCircle,
    path: "/ai-chat",
  },
  {
    name: "Settings",
    icon: Settings,
    path: "/profile",
  },
];

function DashboardSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const displayName = user?.name || "Business User";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <aside className="flex h-screen w-72 flex-col border-r border-stone-200 bg-[#FEFDFB]">
      {/* Logo */}
      <div className="border-b border-stone-200 px-7 py-7">
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
          BillBuddy AI
        </h1>
        <p className="mt-1 text-xs font-medium text-slate-500">
          Smart Business & Bill Manager
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-5 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3.5 rounded-2xl px-4 py-3 font-medium text-sm transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-md font-semibold"
                    : "text-slate-700 hover:bg-slate-100"
                }`
              }
            >
              <Icon size={20} />
              {item.name}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer User Info & Logout */}
      <div className="border-t border-stone-200 p-4">
        <div className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 p-3 border border-slate-100">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-sm font-bold text-white shadow-sm">
              {initial}
            </div>

            <div className="min-w-0">
              <h3 className="truncate text-sm font-semibold text-slate-800">
                {displayName}
              </h3>
              <p className="truncate text-xs text-slate-400">
                {user?.email || "Account"}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            title="Sign Out"
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
          >
            <LogOut size={17} />
          </button>
        </div>
      </div>
    </aside>
  );
}

export default DashboardSidebar;
