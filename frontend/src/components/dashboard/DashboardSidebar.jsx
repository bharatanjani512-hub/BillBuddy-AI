import { useState } from "react";
import {
  LayoutDashboard,
  Receipt,
  Wallet,
  Target,
  Sparkles,
  MessageCircle,
  Settings,
  LogOut,
  Menu,
  X,
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
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const displayName = user?.name || "Business User";
  const initial = displayName.charAt(0).toUpperCase();

  const renderNavLinks = () => (
    <nav className="flex-1 px-4 py-5 space-y-1.5 overflow-y-auto">
      {menuItems.map((item) => {
        const Icon = item.icon;

        return (
          <NavLink
            key={item.name}
            to={item.path}
            onClick={() => setMobileOpen(false)}
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
  );

  const renderUserFooter = () => (
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
  );

  return (
    <>
      {/* ── Mobile Top Header (Phone only) ── */}
      <header className="md:hidden sticky top-0 z-30 flex items-center justify-between border-b border-stone-200 bg-[#FEFDFB]/95 backdrop-blur-md px-4 py-3 shadow-xs">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-xl p-2 text-slate-700 hover:bg-slate-100 transition active:scale-95"
            aria-label="Open Navigation"
          >
            <Menu size={22} />
          </button>
          <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
            BillBuddy AI
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-violet-600 text-xs font-bold text-white shadow-sm">
            {initial}
          </div>
        </div>
      </header>

      {/* ── Mobile Slide-Over Drawer (Phone only) ── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
          />

          {/* Drawer Content */}
          <aside className="fixed inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col border-r border-stone-200 bg-[#FEFDFB] shadow-2xl z-10">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-stone-200 px-6 py-5">
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                  BillBuddy AI
                </h1>
                <p className="mt-0.5 text-xs font-medium text-slate-500">
                  Smart Business & Bill Manager
                </p>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Links */}
            {renderNavLinks()}

            {/* Footer */}
            {renderUserFooter()}
          </aside>
        </div>
      )}

      {/* ── Desktop Persistent Sidebar ── */}
      <aside className="hidden md:flex h-screen w-64 lg:w-72 shrink-0 flex-col sticky top-0 border-r border-stone-200 bg-[#FEFDFB]">
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
        {renderNavLinks()}

        {/* User Info & Logout */}
        {renderUserFooter()}
      </aside>
    </>
  );
}

export default DashboardSidebar;
