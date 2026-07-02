import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { getAllBrandLogoSources } from "@/data/warehouse/brandLogos";

export function BrandIcon({ brand, color, size = "md", showLabel = false, plain = false }) {
  const logoSizes = {
    sm: "h-6 w-14",
    md: "h-8 w-16",
    lg: "h-10 w-20",
  };
  const fallbackSizes = {
    sm: "h-7 w-7 text-[10px]",
    md: "h-9 w-9 text-xs",
    lg: "h-11 w-11 text-sm",
  };
  const [srcIndex, setSrcIndex] = useState(0);
  const sources = brand ? getAllBrandLogoSources(brand) : [];

  useEffect(() => {
    setSrcIndex(0);
  }, [brand]);

  const currentSrc = sources[srcIndex];
  const showImage = currentSrc && srcIndex < sources.length;
  const initials = brand?.substring(0, 2).toUpperCase() || "??";

  const handleError = () => {
    if (srcIndex < sources.length - 1) setSrcIndex((i) => i + 1);
    else setSrcIndex(sources.length);
  };

  return (
    <div className="flex shrink-0 flex-col items-center gap-0.5" title={brand}>
      {showImage ? (
        plain ? (
          <img
            src={currentSrc}
            alt={brand}
            className={`${logoSizes[size]} object-contain`}
            onError={handleError}
          />
        ) : (
          <div className={`flex ${logoSizes[size]} items-center justify-center rounded-lg bg-white p-1 ring-1 ring-slate-100`}>
            <img
              src={currentSrc}
              alt={brand}
              className="max-h-full max-w-full object-contain"
              onError={handleError}
            />
          </div>
        )
      ) : (
        <div
          className={`flex ${fallbackSizes[size]} items-center justify-center rounded-lg font-bold text-white shadow-sm`}
          style={{ backgroundColor: color || "#64748b" }}
        >
          {initials}
        </div>
      )}
      {showLabel && brand && (
        <span className="max-w-[72px] truncate text-[10px] font-semibold text-slate-700">{brand}</span>
      )}
    </div>
  );
}

BrandIcon.propTypes = {
  brand: PropTypes.string,
  color: PropTypes.string,
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  showLabel: PropTypes.bool,
  plain: PropTypes.bool,
};

export default BrandIcon;
