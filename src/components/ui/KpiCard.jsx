import PropTypes from "prop-types";
import { Tooltip, Typography } from "@material-tailwind/react";
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from "@heroicons/react/24/solid";

export function KpiCard({ icon: Icon, title, value, trend, tooltip, onClick }) {
  const showTrend = typeof trend === "number";
  const isPositive = showTrend && trend >= 0;

  const className = `w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-left shadow-sm transition-all ${
    onClick ? "cursor-pointer hover:border-slate-300 hover:shadow-md" : "cursor-default"
  }`;

  const content = (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100">
            {Icon ? <Icon className="h-5 w-5 shrink-0 text-slate-600" aria-hidden /> : null}
          </div>
          <div className="min-w-0 flex-1">
            <Typography className="text-xs font-medium text-slate-500">{title}</Typography>
            <Typography className="text-xl tracking-tight text-slate-900">
              {typeof value === "number" ? value.toLocaleString() : value}
            </Typography>
          </div>
          {showTrend && (
            <div className="flex shrink-0 items-center gap-0.5 text-xs font-medium text-slate-500">
              {isPositive ? (
                <ArrowTrendingUpIcon className="h-3.5 w-3.5 shrink-0" />
              ) : (
                <ArrowTrendingDownIcon className="h-3.5 w-3.5 shrink-0" />
              )}
              {isPositive ? "+" : ""}
              {trend}%
            </div>
          )}
        </div>
  );

  return (
    <Tooltip content={tooltip || (onClick ? "Click to view in Orders" : undefined)}>
      {onClick ? (
        <button type="button" onClick={onClick} className={className}>
          {content}
        </button>
      ) : (
        <div className={className}>{content}</div>
      )}
    </Tooltip>
  );
}

KpiCard.propTypes = {
  icon: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  trend: PropTypes.number,
  tooltip: PropTypes.string,
  onClick: PropTypes.func,
};

export default KpiCard;
