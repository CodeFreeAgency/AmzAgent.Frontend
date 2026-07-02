import PropTypes from "prop-types";
import { Typography } from "@material-tailwind/react";

export function PageCard({ title, subtitle, icon: Icon, action, children, className = "", compact = false }) {
  const headerPad = compact ? "px-4 py-2.5" : "px-6 py-4";
  const bodyPad = compact ? "p-4" : "p-6";

  return (
    <div className={`rounded-lg border border-slate-200 bg-white shadow-sm ${className}`}>
      {(title || action) && (
        <div className={`flex items-center justify-between border-b border-slate-100 ${headerPad}`}>
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-600 ring-1 ring-orange-100">
                <Icon className="h-5 w-5" aria-hidden />
              </div>
            )}
            <div>
              {title && <Typography className="text-base font-semibold text-slate-900">{title}</Typography>}
              {subtitle && <Typography className="mt-0.5 text-sm text-slate-500">{subtitle}</Typography>}
            </div>
          </div>
          {action}
        </div>
      )}
      <div className={bodyPad}>{children}</div>
    </div>
  );
}

PageCard.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  icon: PropTypes.elementType,
  action: PropTypes.node,
  children: PropTypes.node,
  className: PropTypes.string,
  compact: PropTypes.bool,
};

export default PageCard;
