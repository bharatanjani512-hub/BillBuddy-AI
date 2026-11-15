import { useState } from "react";
import {
  Building2,
  User,
  Plus,
  Check,
  ChevronDown,
  Briefcase,
  Layers,
  Wallet,
  UserPlus,
  ArrowUpRight,
  X,
} from "lucide-react";
import { useWorkspace } from "../../context/WorkspaceContext";

export default function WorkspaceSelector() {
  const {
    workspaces,
    currentWorkspace,
    wallets,
    selectWorkspace,
    createWorkspace,
    addFunds,
    inviteMember,
  } = useWorkspace();

  const [isOpen, setIsOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [addFundsOpen, setAddFundsOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);

  // New Workspace form state
  const [name, setName] = useState("");
  const [type, setType] = useState("corporate");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Add Funds form state
  const [fundAmount, setFundAmount] = useState("");
  const [fundNotes, setFundNotes] = useState("");

  // Invite Member form state
  const [inviteEmail, setInviteEmail] = useState("");

  const activeWallet = wallets && wallets.length > 0 ? wallets[0] : null;

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setSubmitting(true);
      await createWorkspace({
        name: name.trim(),
        type,
        description: description.trim() || undefined,
        icon: type === "corporate" ? "Building2" : "User",
      });
      setName("");
      setDescription("");
      setModalOpen(false);
      setIsOpen(false);
    } catch (err) {
      alert("Failed to create workspace. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeposit = async (e) => {
    e.preventDefault();
    if (!fundAmount || !activeWallet) return;

    try {
      setSubmitting(true);
      await addFunds(activeWallet._id, fundAmount, fundNotes);
      setFundAmount("");
      setFundNotes("");
      setAddFundsOpen(false);
      alert(`Successfully added funds to ${activeWallet.name}!`);
    } catch (err) {
      alert("Failed to add funds. Please check permissions.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendInvite = async (e) => {
    e.preventDefault();
    if (!inviteEmail || !currentWorkspace) return;

    try {
      setSubmitting(true);
      await inviteMember(currentWorkspace._id, inviteEmail);
      setInviteEmail("");
      setInviteOpen(false);
      alert(`Invited ${inviteEmail} to ${currentWorkspace.name}!`);
    } catch (err) {
      alert("Failed to invite member.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative w-full">
      {/* ── Main Selector Trigger ── */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between gap-2.5 rounded-xl border border-[#E0E6DC] bg-[#F4F7F2] p-2.5 text-left transition hover:border-[#365314]/40 hover:bg-[#EDF2EB]"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg shadow-2xs ${
              currentWorkspace?.type === "corporate" || currentWorkspace?.type === "business"
                ? "bg-gradient-to-br from-[#1C2C1A] to-[#365314] text-white"
                : "bg-stone-200 text-stone-700"
            }`}
          >
            {currentWorkspace?.type === "corporate" || currentWorkspace?.type === "business" ? (
              <Building2 size={16} />
            ) : (
              <User size={16} />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="truncate text-xs font-bold text-stone-900">
                {currentWorkspace?.name || "Personal Finances"}
              </span>
            </div>
            <p className="truncate text-[10px] uppercase tracking-wider text-stone-500 font-medium">
              {currentWorkspace?.type === "corporate" || currentWorkspace?.type === "business"
                ? "Corporate Workspace"
                : "Personal Folder"}
            </p>
          </div>
        </div>
        <ChevronDown size={15} className={`text-stone-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* ── Corporate Wallet Mini-Badge if active ── */}
      {currentWorkspace?.type === "corporate" && activeWallet && (
        <div className="mt-2 rounded-xl border border-[#365314]/20 bg-gradient-to-br from-[#1C2C1A] to-[#253A22] p-2.5 text-white shadow-xs">
          <div className="flex items-center justify-between text-[11px] text-lime-200/90 font-medium">
            <span className="flex items-center gap-1">
              <Wallet size={12} />
              Corporate Wallet
            </span>
            <button
              onClick={() => setAddFundsOpen(true)}
              className="text-[10px] text-white underline hover:text-lime-300 font-semibold"
            >
              + Add Funds
            </button>
          </div>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-base font-bold tracking-tight text-white">
              ₹{activeWallet.balance?.toLocaleString("en-IN", { minimumFractionDigits: 2 }) || "0.00"}
            </span>
            <span className="text-[10px] text-stone-300">
              Spent: ₹{activeWallet.total_spent?.toLocaleString("en-IN") || "0"}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between border-t border-white/10 pt-1.5 text-[10px] text-stone-300">
            <span>{currentWorkspace.members?.length || 1} Team Member(s)</span>
            <button
              onClick={() => setInviteOpen(true)}
              className="flex items-center gap-1 text-lime-300 hover:text-white"
            >
              <UserPlus size={11} /> Invite
            </button>
          </div>
        </div>
      )}

      {/* ── Dropdown Menu ── */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 right-0 top-full z-50 mt-1.5 rounded-xl border border-[#E0E6DC] bg-white p-1.5 shadow-xl">
            <div className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-stone-400">
              Your Folders & Workspaces
            </div>

            <div className="max-h-56 space-y-1 overflow-y-auto">
              {workspaces.map((ws) => {
                const isActive = ws._id === currentWorkspace?._id;
                const isCorp = ws.type === "corporate" || ws.type === "business";

                return (
                  <button
                    key={ws._id}
                    onClick={() => {
                      selectWorkspace(ws);
                      setIsOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-xs transition ${
                      isActive
                        ? "bg-[#1C2C1A] text-white font-semibold"
                        : "text-stone-700 hover:bg-[#F4F7F2]"
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {isCorp ? <Building2 size={14} className={isActive ? "text-lime-300" : "text-stone-500"} /> : <User size={14} className={isActive ? "text-lime-300" : "text-stone-500"} />}
                      <span className="truncate">{ws.name}</span>
                    </div>
                    {isActive && <Check size={14} className="text-lime-300 shrink-0" />}
                  </button>
                );
              })}
            </div>

            <div className="my-1 border-t border-[#E0E6DC]" />

            <button
              onClick={() => {
                setIsOpen(false);
                setModalOpen(true);
              }}
              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-semibold text-[#253A22] hover:bg-[#EDF2EB] transition"
            >
              <Plus size={14} />
              <span>Create Folder / Workspace</span>
            </button>
          </div>
        </>
      )}

      {/* ── Modal: Create New Workspace / Folder ── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs" onClick={() => setModalOpen(false)} />
          <div className="relative w-full max-w-md rounded-2xl border border-[#E0E6DC] bg-white p-6 shadow-2xl z-10">
            <div className="flex items-center justify-between border-b border-[#E0E6DC] pb-4">
              <div>
                <h3 className="text-lg font-bold text-stone-900">New Folder / Workspace</h3>
                <p className="text-xs text-stone-500">Organize personal expenses, hotel bills, or team budgets.</p>
              </div>
              <button onClick={() => setModalOpen(false)} className="rounded-lg p-1 text-stone-400 hover:bg-stone-100">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Workspace Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. The Grand Hotel, Travel, Freelance Agency"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-[#E0E6DC] bg-[#F4F7F2] px-3.5 py-2.5 text-sm text-stone-900 focus:border-[#365314] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Workspace Type
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setType("corporate")}
                    className={`flex flex-col items-start rounded-xl border p-3 text-left transition ${
                      type === "corporate"
                        ? "border-[#365314] bg-[#365314]/5 ring-1 ring-[#365314]"
                        : "border-[#E0E6DC] hover:bg-stone-50"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs text-stone-900">
                      <Building2 size={15} className="text-[#365314]" />
                      Corporate / Team
                    </div>
                    <span className="text-[10px] text-stone-500 mt-1">
                      Includes Shared Corporate Wallet, budget allocation & multi-user expense tracking.
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setType("personal")}
                    className={`flex flex-col items-start rounded-xl border p-3 text-left transition ${
                      type === "personal"
                        ? "border-[#365314] bg-[#365314]/5 ring-1 ring-[#365314]"
                        : "border-[#E0E6DC] hover:bg-stone-50"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs text-stone-900">
                      <User size={15} className="text-stone-700" />
                      Personal Folder
                    </div>
                    <span className="text-[10px] text-stone-500 mt-1">
                      Dedicated isolated bills & budget folder (e.g. Vacation, Side Project).
                    </span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Description (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Operations bills & vendor expenses for the hotel"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-xl border border-[#E0E6DC] bg-[#F4F7F2] px-3.5 py-2 text-sm text-stone-900 focus:border-[#365314] focus:bg-white focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#E0E6DC]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl border border-[#E0E6DC] px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl bg-gradient-to-r from-[#1C2C1A] to-[#365314] px-5 py-2 text-xs font-bold text-white shadow-xs hover:brightness-110 disabled:opacity-50"
                >
                  {submitting ? "Creating..." : "Create Workspace"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Modal: Add Funds to Corporate Wallet ── */}
      {addFundsOpen && activeWallet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs" onClick={() => setAddFundsOpen(false)} />
          <div className="relative w-full max-w-sm rounded-2xl border border-[#E0E6DC] bg-white p-6 shadow-2xl z-10">
            <div className="flex items-center justify-between border-b border-[#E0E6DC] pb-3">
              <div>
                <h3 className="text-base font-bold text-stone-900">Add Corporate Funds</h3>
                <p className="text-xs text-stone-500">{activeWallet.name}</p>
              </div>
              <button onClick={() => setAddFundsOpen(false)} className="rounded-lg p-1 text-stone-400 hover:bg-stone-100">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleDeposit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Amount (₹ INR)
                </label>
                <input
                  type="number"
                  step="any"
                  min="1"
                  required
                  placeholder="e.g. 50000"
                  value={fundAmount}
                  onChange={(e) => setFundAmount(e.target.value)}
                  className="w-full rounded-xl border border-[#E0E6DC] bg-[#F4F7F2] px-3.5 py-2.5 text-base font-bold text-stone-900 focus:border-[#365314] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Funding Note / Source
                </label>
                <input
                  type="text"
                  placeholder="e.g. Monthly Operations Budget Deposit"
                  value={fundNotes}
                  onChange={(e) => setFundNotes(e.target.value)}
                  className="w-full rounded-xl border border-[#E0E6DC] bg-[#F4F7F2] px-3.5 py-2 text-xs text-stone-900 focus:border-[#365314] focus:bg-white focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E0E6DC]">
                <button
                  type="button"
                  onClick={() => setAddFundsOpen(false)}
                  className="rounded-xl border border-[#E0E6DC] px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl bg-gradient-to-r from-[#1C2C1A] to-[#365314] px-5 py-2 text-xs font-bold text-white shadow-xs hover:brightness-110 disabled:opacity-50"
                >
                  {submitting ? "Depositing..." : "Deposit Funds"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Modal: Invite Team Member ── */}
      {inviteOpen && currentWorkspace && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs" onClick={() => setInviteOpen(false)} />
          <div className="relative w-full max-w-sm rounded-2xl border border-[#E0E6DC] bg-white p-6 shadow-2xl z-10">
            <div className="flex items-center justify-between border-b border-[#E0E6DC] pb-3">
              <div>
                <h3 className="text-base font-bold text-stone-900">Invite Team Member</h3>
                <p className="text-xs text-stone-500">Allow spending & bill submission</p>
              </div>
              <button onClick={() => setInviteOpen(false)} className="rounded-lg p-1 text-stone-400 hover:bg-stone-100">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSendInvite} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Member Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="employee@company.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full rounded-xl border border-[#E0E6DC] bg-[#F4F7F2] px-3.5 py-2.5 text-sm text-stone-900 focus:border-[#365314] focus:bg-white focus:outline-none"
                />
              </div>

              <div className="rounded-xl bg-[#F4F7F2] p-3 text-[11px] text-stone-600 border border-[#E0E6DC]">
                🛡️ <strong>Privacy Protection:</strong> Team members can submit bills against this corporate wallet, but their personal bills remain 100% private.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E0E6DC]">
                <button
                  type="button"
                  onClick={() => setInviteOpen(false)}
                  className="rounded-xl border border-[#E0E6DC] px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl bg-gradient-to-r from-[#1C2C1A] to-[#365314] px-5 py-2 text-xs font-bold text-white shadow-xs hover:brightness-110 disabled:opacity-50"
                >
                  {submitting ? "Inviting..." : "Send Invite"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
