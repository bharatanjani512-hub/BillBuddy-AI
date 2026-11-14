import { Plus, Camera, Sparkles } from "lucide-react";

const BillsHeader = ({ onAddBill, onScanBill, scanning = false }) => {
  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-800">
          Bills & Receipts 🧾
        </h1>
        <p className="mt-1 text-slate-500">
          Scan electricity, utilities, vendor bills, and track paid vs pending expenses.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Scan with AI Button */}
        <label
          className={`flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3 font-semibold text-white shadow-md transition cursor-pointer hover:opacity-95 ${
            scanning ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          {scanning ? (
            <Sparkles size={18} className="animate-spin" />
          ) : (
            <Camera size={18} />
          )}
          {scanning ? "AI Scanning Bill..." : "Scan Bill with AI"}
          <input
            type="file"
            accept="image/*,.pdf"
            disabled={scanning}
            onChange={onScanBill}
            className="hidden"
          />
        </label>

        {/* Manual Add Button */}
        <button
          onClick={onAddBill}
          className="flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-md transition hover:bg-blue-700"
        >
          <Plus size={18} />
          Add Bill
        </button>
      </div>
    </div>
  );
};

export default BillsHeader;
