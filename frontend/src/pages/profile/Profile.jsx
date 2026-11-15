import { useState } from "react";
import DashboardSidebar from "../../components/dashboard/DashboardSidebar";
import { useAuth } from "../../hooks/useAuth";
import {
  User,
  Mail,
  Shield,
  CreditCard,
  Zap,
  Check,
  LogOut,
  Bell,
} from "lucide-react";

function Profile() {
  const { user, logout } = useAuth();

  const [savedSettings, setSavedSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    businessName: "Chauhan Enterprises",
    currency: "INR (₹)",
    defaultPaymentMode: "UPI",
    autoPayElectricity: true,
    autoPayInternet: true,
    emailAlerts: true,
  });

  const handleToggle = (key) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSavedSettings(true);
    setTimeout(() => setSavedSettings(false), 3000);
  };

  const displayName = user?.name || "Business Owner";
  const displayEmail = user?.email || "user@billbuddy.ai";

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#F4F6F2]">
      <DashboardSidebar />

      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 min-w-0">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-stone-900">
            Account & Settings
          </h1>
          <p className="mt-1 text-sm text-stone-500">
            Manage your personal profile, business billing preferences, and auto-pay settings.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column: Profile Card */}
          <div className="rounded-2xl border border-[#E0E6DC] bg-white p-8 shadow-xs text-center flex flex-col items-center">
            <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-[#1C2C1A] to-[#365314] flex items-center justify-center text-3xl font-bold text-white shadow-xs mb-4">
              {displayName.charAt(0).toUpperCase()}
            </div>

            <h2 className="text-2xl font-bold text-slate-800">{displayName}</h2>
            <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-1">
              <Mail size={15} /> {displayEmail}
            </p>

            <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3.5 py-1 text-xs font-semibold text-blue-700 border border-blue-200">
              <Shield size={13} /> Business Account
            </span>

            <div className="w-full border-t border-slate-100 mt-6 pt-6 space-y-3 text-left text-sm text-slate-600">
              <div className="flex justify-between">
                <span className="text-slate-400">Status</span>
                <span className="font-semibold text-emerald-600">Active</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Bill Management</span>
                <span className="font-semibold text-slate-700">AI Powered</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Scanner Engine</span>
                <span className="font-semibold text-violet-600">Gemini 2.0 Vision</span>
              </div>
            </div>

            <button
              onClick={logout}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100"
            >
              <LogOut size={16} /> Sign Out
            </button>
          </div>

          {/* Right Column: Settings & Auto-Pay */}
          <div className="lg:col-span-2 space-y-8">
            {/* Auto-Pay & Automation */}
            <div className="rounded-3xl border border-stone-200 bg-[#FEFDFB] p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="rounded-xl bg-amber-100 p-2.5 text-amber-600">
                  <Zap size={22} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">
                    Smart Bill Automation & Auto-Pay
                  </h3>
                  <p className="text-sm text-slate-500">
                    Set up one-time rules for recurring business and daily bills.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50">
                  <div>
                    <p className="font-semibold text-slate-800">Electricity & Utility Bills</p>
                    <p className="text-xs text-slate-500">
                      Flag state board electricity bills as priority auto-pay reminders.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.autoPayElectricity}
                    onChange={() => handleToggle("autoPayElectricity")}
                    className="h-5 w-5 accent-blue-600 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50">
                  <div>
                    <p className="font-semibold text-slate-800">Internet & Broadband Bills</p>
                    <p className="text-xs text-slate-500">
                      Notify before due date and mark recurring monthly expense.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.autoPayInternet}
                    onChange={() => handleToggle("autoPayInternet")}
                    className="h-5 w-5 accent-blue-600 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50">
                  <div>
                    <p className="font-semibold text-slate-800">Email Due Date Alerts</p>
                    <p className="text-xs text-slate-500">
                      Send daily summary for bills due within 3 days.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.emailAlerts}
                    onChange={() => handleToggle("emailAlerts")}
                    className="h-5 w-5 accent-blue-600 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Business Preferences */}
            <form onSubmit={handleSave} className="rounded-3xl border border-stone-200 bg-[#FEFDFB] p-8 shadow-sm">
              <h3 className="text-xl font-bold text-slate-800 mb-6">
                Business & Currency Preferences
              </h3>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Business / Entity Name
                  </label>
                  <input
                    type="text"
                    value={preferences.businessName}
                    onChange={(e) => setPreferences({ ...preferences, businessName: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Primary Currency
                  </label>
                  <select
                    value={preferences.currency}
                    onChange={(e) => setPreferences({ ...preferences, currency: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 bg-white"
                  >
                    <option value="INR (₹)">INR (₹) - Indian Rupee</option>
                    <option value="USD ($)">USD ($) - US Dollar</option>
                    <option value="EUR (€)">EUR (€) - Euro</option>
                    <option value="GBP (£)">GBP (£) - British Pound</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Default Payment Method
                  </label>
                  <select
                    value={preferences.defaultPaymentMode}
                    onChange={(e) => setPreferences({ ...preferences, defaultPaymentMode: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 bg-white"
                  >
                    <option value="UPI">UPI (GPay / PhonePe / Paytm)</option>
                    <option value="Net Banking">Net Banking</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Debit Card">Debit Card</option>
                    <option value="Cash">Cash</option>
                  </select>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-6">
                {savedSettings && (
                  <p className="flex items-center gap-1 text-sm font-semibold text-emerald-600">
                    <Check size={16} /> Preferences updated successfully!
                  </p>
                )}
                {!savedSettings && <span />}

                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-[#1C2C1A] to-[#365314] hover:from-[#152213] hover:to-[#2B4210] px-6 py-2.5 text-sm font-semibold text-white shadow-xs transition active:scale-[0.99]"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Profile;
