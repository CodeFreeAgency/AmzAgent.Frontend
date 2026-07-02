import PropTypes from "prop-types";
import { useNavigate, useLocation } from "react-router-dom";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useOrderSearch } from "@/context/orderSearch";

const sizeClasses = {
  medium: "w-72",
  full: "min-w-[200px] flex-1 md:max-w-lg",
};

export function OrderSearchInput({ size = "full", className = "" }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { draft, setDraft, applied, commitSearch, clearSearch } = useOrderSearch();
  const hasDraft = draft.length > 0;
  const isApplied = applied.length > 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    commitSearch();
    if (!pathname.startsWith("/dashboard/orders")) {
      navigate("/dashboard/orders");
    }
  };

  const handleClear = () => {
    clearSearch();
    if (!pathname.startsWith("/dashboard/orders")) return;
    navigate("/dashboard/orders", { replace: true });
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${sizeClasses[size]} ${className}`}>
      <MagnifyingGlassIcon
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
        strokeWidth={2}
      />
      <input
        type="text"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        placeholder="Search orders, SKUs, tracking…"
        aria-label="Search orders, SKUs, tracking"
        className={`w-full rounded-xl border bg-white py-2.5 pl-10 pr-20 text-sm text-slate-900 shadow-sm outline-none transition-colors placeholder:text-slate-400 focus:ring-2 focus:ring-blue-100 ${
          isApplied ? "border-blue-300 focus:border-blue-400" : "border-slate-200 focus:border-blue-300"
        }`}
      />
      {hasDraft && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-14 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          aria-label="Clear search"
        >
          <XMarkIcon className="h-4 w-4" />
        </button>
      )}
      <span className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-medium text-slate-400 sm:inline-block">
        Enter
      </span>
    </form>
  );
}

OrderSearchInput.propTypes = {
  size: PropTypes.oneOf(["medium", "full"]),
  className: PropTypes.string,
};

export default OrderSearchInput;
