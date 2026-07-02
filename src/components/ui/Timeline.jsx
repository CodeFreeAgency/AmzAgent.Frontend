import PropTypes from "prop-types";
import { Typography } from "@material-tailwind/react";
import {
  ShoppingBagIcon, ArchiveBoxIcon, TagIcon, TruckIcon, CheckCircleIcon,
} from "@heroicons/react/24/solid";

const ICONS = {
  "Order received": ShoppingBagIcon,
  "Order packed": ArchiveBoxIcon,
  "Label generated": TagIcon,
  Dispatched: TruckIcon,
  Delivered: CheckCircleIcon,
};

const COLORS = {
  "Order received": "bg-blue-500",
  "Order packed": "bg-violet-500",
  "Label generated": "bg-amber-500",
  Dispatched: "bg-orange-500",
  Delivered: "bg-emerald-500",
};

export function Timeline({ events }) {
  return (
    <div className="space-y-0">
      {events.map((item, idx) => {
        const Icon = ICONS[item.event] || ShoppingBagIcon;
        const isLast = idx === events.length - 1;
        return (
          <div key={item.id ?? idx} className="relative flex gap-4 pb-6 animate-fade-in">
            {!isLast && (
              <div className="absolute left-[15px] top-8 h-full w-0.5 bg-slate-200" />
            )}
            <div className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${COLORS[item.event] || "bg-slate-400"} shadow-md`}>
              <Icon className="h-4 w-4 text-white" />
            </div>
            <div className="min-w-0 flex-1 pt-0.5">
              <Typography className="text-sm font-medium text-slate-900">{item.event}</Typography>
              {item.orderId && (
                <Typography className="text-xs text-blue-600">{item.orderId}</Typography>
              )}
              <Typography className="mt-0.5 text-xs text-slate-400">
                {item.time instanceof Date
                  ? item.time.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
                  : item.time}
              </Typography>
            </div>
          </div>
        );
      })}
    </div>
  );
}

Timeline.propTypes = {
  events: PropTypes.array.isRequired,
};

export default Timeline;
