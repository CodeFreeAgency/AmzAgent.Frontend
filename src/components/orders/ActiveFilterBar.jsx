import PropTypes from "prop-types";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { getActiveFilterLabels, removeFilterChip, DEFAULT_FILTERS } from "./orderFilterUtils";

const TABS = [
  { key: "orders", label: "All Orders" },
  { key: "dhl", label: "DHL Labels" },
  { key: "review", label: "Needs Review" },
];

export function ActiveFilterBar({
  activeTab,
  onTabChange,
  reviewCount,
  filters,
  onChange,
  resultCount,
  onSelectAll,
  selectedCount,
  bulkActions,
}) {
  const chips = getActiveFilterLabels(filters);
  const showOrderActions = activeTab === "orders";
  const bulkMode = selectedCount > 0;
  const showSelectAll = showOrderActions && onSelectAll && resultCount > 0 && !bulkMode;
  const showClearFilters = showOrderActions && !bulkMode;

  return (
    <div className="flex min-h-[41px] flex-wrap items-center gap-3 border-b border-slate-100 bg-white px-4 py-2">
      <div className="inline-flex gap-1 rounded-lg border border-slate-200 bg-slate-100 p-1">
        {TABS.map(({ key, label }) => {
          const tabLabel = key === "review" ? `${label} (${reviewCount})` : label;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onTabChange(key)}
              className={`rounded-md px-4 py-2 text-sm font-semibold transition-all ${
                activeTab === key
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {tabLabel}
            </button>
          );
        })}
      </div>

      {showOrderActions &&
        chips.map((chip) => (
          <button
            key={chip.key}
            type="button"
            onClick={() => onChange(removeFilterChip(filters, chip))}
            className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-white px-2.5 py-1 text-xs font-medium text-blue-700 hover:bg-blue-50"
          >
            {chip.label}
            <XMarkIcon className="h-3 w-3" />
          </button>
        ))}

      {bulkActions}

      {(showSelectAll || showClearFilters) && (
        <div className="ml-auto flex items-center gap-3">
          {showSelectAll && (
            <button
              type="button"
              onClick={onSelectAll}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800"
            >
              {selectedCount === resultCount ? "Deselect all" : `Select all (${resultCount})`}
            </button>
          )}
          {showClearFilters && (
            <button
              type="button"
              onClick={() =>
                onChange({
                  ...DEFAULT_FILTERS,
                  dateRange: filters.dateRange,
                  columnFilters: { ...DEFAULT_FILTERS.columnFilters },
                })
              }
              className="text-xs font-medium text-slate-500 hover:text-slate-700"
            >
              Clear filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}

ActiveFilterBar.propTypes = {
  activeTab: PropTypes.string.isRequired,
  onTabChange: PropTypes.func.isRequired,
  reviewCount: PropTypes.number.isRequired,
  filters: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  resultCount: PropTypes.number,
  onSelectAll: PropTypes.func,
  selectedCount: PropTypes.number,
  bulkActions: PropTypes.node,
};

export default ActiveFilterBar;
