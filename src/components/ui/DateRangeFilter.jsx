import PropTypes from "prop-types";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";
import { DATE_PRESETS, formatDateRangeLabel } from "@/utils/dateRange";

export function DateRangePill({ value, className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm ${className}`}
    >
      <CalendarDaysIcon className="h-5 w-5 shrink-0 text-slate-500" strokeWidth={1.5} />
      <span className="whitespace-nowrap">{formatDateRangeLabel(value)}</span>
    </span>
  );
}

DateRangePill.propTypes = {
  value: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export function DateRangeChips({ value, onChange, className = "", todayOnly = false }) {
  if (todayOnly) {
    return <DateRangePill value="today" className={className} />;
  }

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2 py-1.5 shadow-sm ${className}`}
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50">
        <CalendarDaysIcon className="h-4 w-4 text-blue-600" strokeWidth={2} />
      </div>
      <div className="flex flex-wrap items-center gap-1">
        {DATE_PRESETS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              value === key
                ? "bg-blue-100 text-blue-800 ring-1 ring-blue-300"
                : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

DateRangeChips.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  className: PropTypes.string,
  todayOnly: PropTypes.bool,
};

export default DateRangeChips;
