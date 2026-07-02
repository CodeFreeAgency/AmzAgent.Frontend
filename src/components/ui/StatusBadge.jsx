import PropTypes from "prop-types";

const STYLES = {
  red: "bg-red-50 text-red-700 ring-red-600/20",
  orange: "bg-orange-50 text-orange-700 ring-orange-600/20",
  yellow: "bg-amber-50 text-amber-700 ring-amber-600/20",
  green: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  blue: "bg-blue-50 text-blue-700 ring-blue-600/20",
  gray: "bg-slate-100 text-slate-600 ring-slate-500/20",
};

export function StatusBadge({ label, color = "gray", pulse = false }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset transition-all ${STYLES[color] || STYLES.gray}`}>
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${color === "green" ? "bg-emerald-400" : color === "red" ? "bg-red-400" : "bg-blue-400"}`} />
          <span className={`relative inline-flex h-2 w-2 rounded-full ${color === "green" ? "bg-emerald-500" : color === "red" ? "bg-red-500" : "bg-blue-500"}`} />
        </span>
      )}
      {label}
    </span>
  );
}

StatusBadge.propTypes = {
  label: PropTypes.string.isRequired,
  color: PropTypes.string,
  pulse: PropTypes.bool,
};

export default StatusBadge;
