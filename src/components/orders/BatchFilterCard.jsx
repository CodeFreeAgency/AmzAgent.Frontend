import PropTypes from "prop-types";
import { Tooltip, Typography } from "@material-tailwind/react";

export function BatchFilterCard({ icon: Icon, title, value, active, onClick, tooltip }) {
  return (
    <Tooltip content={tooltip || "Click to filter queue"}>
      <button
        type="button"
        onClick={onClick}
        className={`w-full rounded-lg border bg-white px-4 py-3 text-left shadow-sm transition-all hover:shadow-md ${
          active
            ? "border-blue-400 ring-2 ring-blue-100"
            : "border-slate-200 hover:border-slate-300"
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
              active ? "bg-blue-100" : "bg-slate-100"
            }`}
          >
            {Icon ? (
              <Icon className={`h-5 w-5 shrink-0 ${active ? "text-blue-600" : "text-slate-600"}`} aria-hidden />
            ) : null}
          </div>
          <div className="min-w-0 flex-1">
            <Typography className="text-xs font-medium text-slate-500">{title}</Typography>
            <Typography className="text-xl tracking-tight text-slate-900">
              {typeof value === "number" ? value.toLocaleString() : value}
            </Typography>
          </div>
        </div>
      </button>
    </Tooltip>
  );
}

BatchFilterCard.propTypes = {
  icon: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  active: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  tooltip: PropTypes.string,
};

export default BatchFilterCard;
