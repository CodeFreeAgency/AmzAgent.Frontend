import PropTypes from "prop-types";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";

const ASIN_PATTERN = /^[A-Z0-9]{10}$/i;

export function getAsinFromUrl(url) {
  const match = url?.match(/\/(?:dp|gp\/product)\/([A-Z0-9]{10})(?:[/?]|$)/i);
  return match?.[1]?.toUpperCase() || null;
}

export function normalizeAsin(value) {
  if (!value) return null;
  const trimmed = String(value).trim().toUpperCase();
  return ASIN_PATTERN.test(trimmed) ? trimmed : null;
}

export function getAmazonProductUrl(asin, url) {
  const resolvedAsin = normalizeAsin(asin) || getAsinFromUrl(url);
  if (resolvedAsin) return `https://www.amazon.com/dp/${resolvedAsin}`;
  if (url?.startsWith("http")) return url;
  return null;
}

export function AmazonProductLink({
  asin,
  url,
  size = "sm",
  variant = "icon",
  children,
  className = "",
}) {
  const resolvedAsin = normalizeAsin(asin) || getAsinFromUrl(url);
  const href = getAmazonProductUrl(resolvedAsin, url);
  const label = children ?? resolvedAsin;

  if (!href) {
    return label ? <span className={className}>{label}</span> : null;
  }

  const title = resolvedAsin ? `View on Amazon (${resolvedAsin})` : "View on Amazon";

  if (variant === "text" || variant === "sku") {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        title={title}
        className={`group inline-flex max-w-full items-center gap-1 truncate font-mono text-xs text-blue-600 transition-colors hover:text-blue-800 ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        <span className="truncate group-hover:underline">{label}</span>
        <ArrowTopRightOnSquareIcon
          className="h-3.5 w-3.5 shrink-0 text-blue-400 group-hover:text-blue-700"
          strokeWidth={2}
        />
      </a>
    );
  }

  const iconClass = size === "sm" ? "h-4 w-4" : "h-5 w-5";
  const buttonClass = size === "sm" ? "h-8 w-8" : "h-9 w-9";

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={title}
      className={`inline-flex ${buttonClass} items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-orange-50 hover:text-orange-600 ${className}`}
      onClick={(e) => e.stopPropagation()}
    >
      <ArrowTopRightOnSquareIcon className={iconClass} strokeWidth={2} />
    </a>
  );
}

AmazonProductLink.propTypes = {
  asin: PropTypes.string,
  url: PropTypes.string,
  size: PropTypes.oneOf(["sm", "md"]),
  variant: PropTypes.oneOf(["icon", "text", "sku"]),
  children: PropTypes.node,
  className: PropTypes.string,
};

export default AmazonProductLink;
