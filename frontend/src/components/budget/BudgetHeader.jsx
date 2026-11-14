const BudgetHeader = ({ onAddBudget }) => {
  return (
    <div className="mb-8 flex items-center justify-between">
      <div>
        <h1 className="text-4xl font-bold text-slate-800">
          Budget
        </h1>

        <p className="mt-2 text-slate-500">
          Manage your monthly budgets in one place.
        </p>
      </div>

      <button
        onClick={onAddBudget}
        className="rounded-xl bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700"
      >
        + Add Budget
      </button>
    </div>
  );
};

export default BudgetHeader;