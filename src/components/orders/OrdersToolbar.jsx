import PropTypes from "prop-types";
import { ListBulletIcon, Squares2X2Icon } from "@heroicons/react/24/outline";
import { DateRangeChips } from "@/components/ui";
import { DATE_PRESETS } from "@/utils/dateRange";

const toggleClass = (active) =>
  active
    ? "bg-blue-100 text-blue-800 ring-1 ring-blue-300"
    : "text-slate-600 hover:bg-slate-50";

export function OrdersToolbar({
  resultCount,
  filters,
  onDateChange,
  viewMode,
  onViewModeChange,
  selectedCount,
}) {
  const dateLabel = DATE_PRESETS.find((d) => d.key === filters.dateRange)?.label || "Today";

  return (
    <div className="grid grid-cols-1 items-center gap-3 border-b border-slate-200 bg-white px-4 py-3 lg:grid-cols-[auto_1fr_auto]">
      <div className="min-w-0">
        <p className="text-sm font-bold text-slate-900">
          {resultCount.toLocaleString()} orders
        </p>
        <p className="text-[11px] text-slate-500">
          {selectedCount > 0 ? `${selectedCount} selected · ` : ""}Showing {dateLabel.toLowerCase()}
        </p>
      </div>

      <div className="flex justify-start lg:justify-center">
        <DateRangeChips value={filters.dateRange} onChange={onDateChange} />
      </div>

      <div className="flex justify-start lg:justify-end">
        <div className="inline-flex rounded-xl border border-slate-200 bg-white p-0.5 shadow-sm">
          <button
            type="button"
            onClick={() => onViewModeChange("list")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold ${toggleClass(viewMode === "list")}`}
          >
            <ListBulletIcon className="h-4 w-4 text-current" />
            Order List
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange("sku")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold ${toggleClass(viewMode === "sku")}`}
          >
            <Squares2X2Icon className="h-4 w-4 text-current" />
            Pick by SKU
          </button>
        </div>
      </div>
    </div>
  );
}

OrdersToolbar.propTypes = {
  resultCount: PropTypes.number.isRequired,
  filters: PropTypes.object.isRequired,
  onDateChange: PropTypes.func.isRequired,
  viewMode: PropTypes.string.isRequired,
  onViewModeChange: PropTypes.func.isRequired,
  selectedCount: PropTypes.number,
};

export default OrdersToolbar;
