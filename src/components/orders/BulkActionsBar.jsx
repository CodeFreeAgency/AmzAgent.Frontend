import PropTypes from "prop-types";
import { Button } from "@material-tailwind/react";
import {
  TagIcon,
  ArchiveBoxIcon,
  CloudArrowUpIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

export function BulkActionsBar({
  count,
  onBulkLabel,
  onBulkPack,
  onBulkUpload,
  onClear,
}) {
  if (count === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-blue-200 bg-blue-50/80 px-3 py-2 shadow-sm">
      <span className="text-sm font-semibold text-blue-900">{count} selected</span>
      <Button
        size="sm"
        color="blue"
        className="flex items-center gap-1.5 normal-case"
        onClick={onBulkLabel}
      >
        <TagIcon className="h-4 w-4" />
        Bulk Label
      </Button>
      <Button
        size="sm"
        variant="outlined"
        color="blue"
        className="flex items-center gap-1.5 normal-case"
        onClick={onBulkPack}
      >
        <ArchiveBoxIcon className="h-4 w-4" />
        Mark Packed
      </Button>
      <Button
        size="sm"
        variant="outlined"
        color="blue"
        className="flex items-center gap-1.5 normal-case"
        onClick={onBulkUpload}
      >
        <CloudArrowUpIcon className="h-4 w-4" />
        Upload to Amazon
      </Button>
      <button
        type="button"
        onClick={onClear}
        className="ml-auto inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-slate-600 hover:bg-white/80 hover:text-slate-900"
      >
        <XMarkIcon className="h-3.5 w-3.5" />
        Clear
      </button>
    </div>
  );
}

BulkActionsBar.propTypes = {
  count: PropTypes.number.isRequired,
  onBulkLabel: PropTypes.func.isRequired,
  onBulkPack: PropTypes.func.isRequired,
  onBulkUpload: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
};

export default BulkActionsBar;
