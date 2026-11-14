import {
  Search,
  RefreshCcw,
  Filter,
} from "lucide-react";

const BillsToolbar = ({
  search,
  setSearch,
  filters,
  setFilters,
  onRefresh,
}) => {
  return (
    <div className="mb-6 rounded-2xl bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        {/* Search */}

        <div className="relative w-full lg:max-w-md">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search bills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 outline-none transition focus:border-blue-500 focus:bg-white"
          />
        </div>

        {/* Filters */}

        <div className="flex flex-wrap items-center gap-3">

          <select
            value={filters.category}
            onChange={(e) =>
              setFilters({
                ...filters,
                page: 1,
                category: e.target.value,
              })
            }
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none"
          >
            <option value="">All Categories</option>
            <option value="Food">Food</option>
            <option value="Shopping">Shopping</option>
            <option value="Travel">Travel</option>
            <option value="Bills">Bills</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Education">Education</option>
            <option value="Other">Other</option>
          </select>

          <select
            value={filters.payment_mode}
            onChange={(e) =>
              setFilters({
                ...filters,
                page: 1,
                payment_mode: e.target.value,
              })
            }
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none"
          >
            <option value="">Payment Mode</option>
            <option value="Cash">Cash</option>
            <option value="UPI">UPI</option>
            <option value="Card">Card</option>
            <option value="Net Banking">Net Banking</option>
          </select>

          <select
            value={filters.status}
            onChange={(e) =>
              setFilters({
                ...filters,
                page: 1,
                status: e.target.value,
              })
            }
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none"
          >
            <option value="">All Status</option>
            <option value="Paid">Paid</option>
            <option value="Unpaid">Unpaid</option>
            <option value="Pending">Pending</option>
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
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none"
          >
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
            <option value="highest">Highest Amount</option>
            <option value="lowest">Lowest Amount</option>
            <option value="title_asc">A → Z</option>
            <option value="title_desc">Z → A</option>
          </select>

          <button
            onClick={onRefresh}
            className="rounded-xl border border-slate-200 p-3 transition hover:bg-slate-100"
          >
            <RefreshCcw size={18} />
          </button>

          <button
            className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 transition hover:bg-slate-100"
          >
            <Filter size={18} />
            More Filters
          </button>

        </div>
      </div>
    </div>
  );
};

export default BillsToolbar;