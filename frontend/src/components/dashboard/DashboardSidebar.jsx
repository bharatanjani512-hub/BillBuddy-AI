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
    <nav className="flex-1 px-4 py-5 space-y-1 overflow-y-auto">
      {menuItems.map((item) => {
        const Icon = item.icon;

        return (
          <NavLink
            key={item.name}
            to={item.path}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3.5 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-gradient-to-r from-[#1C2C1A] to-[#2E4829] text-white font-semibold shadow-xs"
                  : "text-stone-600 hover:bg-[#EDF2EB] hover:text-[#1C2C1A]"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  size={19}
                  className={isActive ? "text-lime-300" : "text-stone-500"}
                />
                <span>{item.name}</span>
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  );

  const renderUserFooter = () => (
    <div className="border-t border-[#E0E6DC] p-4">
      <div className="flex items-center justify-between gap-3 rounded-xl bg-[#F4F7F2] p-2.5 border border-[#E0E6DC]">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#1C2C1A] to-[#365314] text-xs font-bold text-white shadow-xs">
            {initial}
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-stone-800">
              {displayName}
            </h3>
            <p className="truncate text-xs text-stone-400">
              {user?.email || "Account"}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          title="Sign Out"
          className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
        >
          <LogOut size={16} />
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* ── Mobile Top Header (Phone only) ── */}
      <header className="md:hidden sticky top-0 z-30 flex items-center justify-between border-b border-[#E0E6DC] bg-white/95 backdrop-blur-md px-4 py-3 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-lg p-2 text-stone-700 hover:bg-[#EDF2EB] transition active:scale-95"
            aria-label="Open Navigation"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-[#1C2C1A] to-[#365314] text-white font-bold text-xs shadow-xs">
              B
            </div>
            <span className="text-lg font-bold tracking-tight text-stone-900">
              BillBuddy
            </span>
            <span className="rounded-md border border-[#365314]/30 bg-[#365314]/10 px-1.5 py-0.5 text-[10px] font-semibold text-[#23381E]">
              AI
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#1C2C1A] to-[#365314] text-xs font-bold text-white shadow-xs">
            {initial}
          </div>
        </div>
      </header>

      {/* ── Mobile Slide-Over Drawer (Phone only) ── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
          />

          {/* Drawer Content */}
          <aside className="fixed inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col border-r border-[#E0E6DC] bg-white shadow-xl z-10">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#E0E6DC] px-6 py-5">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#1C2C1A] to-[#365314] text-white font-bold text-sm shadow-xs">
                  B
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-lg font-bold tracking-tight text-stone-900">
                      BillBuddy
                    </span>
                    <span className="rounded-md border border-[#365314]/30 bg-[#365314]/10 px-1.5 py-0.5 text-[10px] font-semibold text-[#23381E]">
                      AI
                    </span>
                  </div>
                  <p className="text-xs text-stone-400">
                    Smart Bill & Expense Manager
                  </p>
                </div>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="rounded-lg p-1.5 text-stone-400 hover:text-stone-700 hover:bg-[#EDF2EB] transition"
              >
                <X size={18} />
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
      <aside className="hidden md:flex h-screen w-64 lg:w-72 shrink-0 flex-col sticky top-0 border-r border-[#E0E6DC] bg-white">
        {/* Logo */}
        <div className="border-b border-[#E0E6DC] px-6 py-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#1C2C1A] to-[#365314] text-white font-bold text-base shadow-xs">
              B
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-tight text-stone-900">
                  BillBuddy
                </span>
                <span className="rounded-md border border-[#365314]/30 bg-[#365314]/10 px-1.5 py-0.5 text-[10px] font-semibold text-[#23381E]">
                  AI
                </span>
              </div>
              <p className="text-xs text-stone-400 mt-0.5">
                Financial Management
              </p>
            </div>
          </div>
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
