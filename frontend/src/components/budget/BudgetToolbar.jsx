import { Search, RefreshCcw } from "lucide-react";

const BudgetToolbar = ({
  search,
  setSearch,
  filters,
  setFilters,
  onRefresh,
}) => {
  return (
    <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">

        <div className="relative w-full xl:max-w-md">
          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search budgets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 py-3 pl-12 pr-4 outline-none transition focus:border-blue-500"
          />
        </div>

        <div className="flex flex-wrap gap-3">

          <select
            value={filters.month}
            onChange={(e) =>
              setFilters({
                ...filters,
                page: 1,
                month: e.target.value,
              })
            }
            className="rounded-xl border border-slate-200 px-4 py-3"
          >
            <option value="">All Months</option>
            <option value="January">January</option>
            <option value="February">February</option>
            <option value="March">March</option>
            <option value="April">April</option>
            <option value="May">May</option>
            <option value="June">June</option>
            <option value="July">July</option>
            <option value="August">August</option>
            <option value="September">September</option>
            <option value="October">October</option>
            <option value="November">November</option>
            <option value="December">December</option>
          </select>

          <select
            value={filters.sort}
            onChange={(e) =>
              setFilters({
                ...filters,
                page: 1,
                sort: e.target.value,
              })
            }
            className="rounded-xl border border-slate-200 px-4 py-3"
          >
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
            <option value="highest">Highest</option>
            <option value="lowest">Lowest</option>
            <option value="title">Title</option>
          </select>

          <button
            onClick={onRefresh}
            className="rounded-xl border border-slate-200 p-3 transition hover:bg-slate-100"
          >
            <RefreshCcw size={20} />
          </button>

        </div>

      </div>
    </div>
  );
};

export default BudgetToolbar;