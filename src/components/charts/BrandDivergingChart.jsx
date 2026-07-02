import PropTypes from "prop-types";

const BRAND_BAR_CLASSES = {
  Nike: "bg-orange-200",
  Adidas: "bg-blue-200",
  Puma: "bg-amber-200",
  Reebok: "bg-red-200",
  "New Balance": "bg-green-200",
  "Under Armour": "bg-blue-300",
};

const DEFAULT_BAR_CLASS = "bg-slate-200";

export function BrandDivergingChart({ brands, toProcessCounts }) {
  const rows = brands.map((brand, i) => ({
    brand,
    toProcess: toProcessCounts[i],
    barClass: BRAND_BAR_CLASSES[brand] || DEFAULT_BAR_CLASS,
  }));
  const maxCount = Math.max(...toProcessCounts, 1);

  return (
    <div className="w-full select-none">
      <div className="mb-3 flex items-center justify-end gap-2">
        <span className="text-sm text-slate-600">To Process Orders</span>
      </div>

      <div className="space-y-2.5">
        {rows.map((row) => {
          const widthPct = (row.toProcess / maxCount) * 100;

          return (
            <div
              key={row.brand}
              className="grid grid-cols-[minmax(5.5rem,7rem)_1fr_auto] items-center gap-3 sm:grid-cols-[minmax(6rem,8rem)_1fr_auto]"
            >
              <span className="truncate text-sm text-slate-700">{row.brand}</span>

              <div className="h-9 overflow-hidden rounded-md bg-slate-100">
                <div
                  className={`h-full rounded-md ${row.barClass}`}
                  style={{
                    width: `${widthPct}%`,
                    minWidth: row.toProcess > 0 ? "6px" : 0,
                  }}
                />
              </div>

              <span className="w-10 shrink-0 text-right text-sm tabular-nums text-slate-700">
                {row.toProcess.toLocaleString()}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

BrandDivergingChart.propTypes = {
  brands: PropTypes.arrayOf(PropTypes.string).isRequired,
  toProcessCounts: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default BrandDivergingChart;
