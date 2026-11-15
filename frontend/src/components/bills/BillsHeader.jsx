import { Plus, Camera, Sparkles } from "lucide-react";

const BillsHeader = ({ onAddBill, onScanBill, scanning = false }) => {
  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Bills & Receipts
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Scan invoices, track utilities, and manage paid versus pending bills.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Scan with AI Button */}
        <label
          className={`flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#142013] to-[#253A22] px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition cursor-pointer hover:from-[#0E170D] hover:to-[#1E2E1B] active:scale-[0.99] ${
            scanning ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          {scanning ? (
            <Sparkles size={16} className="animate-spin text-lime-300" />
          ) : (
            <Camera size={16} className="text-lime-300" />
          )}
          {scanning ? "Scanning Document..." : "Scan Document with AI"}
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
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1C2C1A] to-[#365314] hover:from-[#152213] hover:to-[#2B4210] px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition active:scale-[0.99]"
        >
          <Plus size={16} />
          Add Bill
        </button>
      </div>
    </div>
  );
};

export default BillsHeader;
