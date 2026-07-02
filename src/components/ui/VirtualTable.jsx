import PropTypes from "prop-types";
import { useRef, useState, useCallback, useEffect, useMemo } from "react";
import { Checkbox } from "@material-tailwind/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

const ROW_HEIGHT = 64;
const SELECT_COL_WIDTH = "4%";
const SELECT_COL_STYLE = { width: SELECT_COL_WIDTH };
const CHECKBOX_CONTAINER_PROPS = { className: "!p-0" };
const SELECT_CELL_CLASS = "overflow-hidden whitespace-nowrap px-2 align-middle";
const SELECT_HEADER_CLASS = "overflow-hidden whitespace-nowrap px-2 py-2.5 text-left";
const DATA_CELL_CLASS = "overflow-hidden whitespace-nowrap align-middle px-3";
const DATA_HEADER_CLASS = "overflow-hidden whitespace-nowrap px-3 py-2.5 text-left";

export function VirtualTable({
  data,
  columns,
  rowHeight = ROW_HEIGHT,
  onRowClick,
  selectedIds = [],
  onSelectChange,
  idKey = "id",
  emptyMessage = "No records found",
  page,
  pageSize,
  totalCount,
  onPageChange,
}) {
  const containerRef = useRef(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(400);

  const updateHeight = useCallback(() => {
    if (containerRef.current) {
      setContainerHeight(containerRef.current.clientHeight);
    }
  }, []);

  useEffect(() => {
    updateHeight();
    const el = containerRef.current;
    if (!el) return undefined;
    const ro = new ResizeObserver(updateHeight);
    ro.observe(el);
    window.addEventListener("resize", updateHeight);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", updateHeight);
    };
  }, [updateHeight]);

  const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - 4);
  const visibleCount = Math.ceil(containerHeight / rowHeight) + 8;
  const endIndex = Math.min(data.length, startIndex + visibleCount);
  const visibleRows = useMemo(
    () => data.slice(startIndex, endIndex),
    [data, startIndex, endIndex]
  );

  const topSpacer = startIndex * rowHeight;
  const bottomSpacer = Math.max(0, (data.length - endIndex) * rowHeight);
  const colSpan = columns.length + (onSelectChange ? 1 : 0);

  const pageIds = useMemo(() => data.map((r) => r[idKey]), [data, idKey]);
  const allSelected = pageIds.length > 0 && pageIds.every((id) => selectedIds.includes(id));
  const someSelected = pageIds.some((id) => selectedIds.includes(id)) && !allSelected;

  const toggleAll = () => {
    if (!onSelectChange) return;
    if (allSelected) {
      onSelectChange(selectedIds.filter((id) => !pageIds.includes(id)));
    } else {
      onSelectChange([...new Set([...selectedIds, ...pageIds])]);
    }
  };

  const toggleRow = (id) => {
    if (!onSelectChange) return;
    onSelectChange(
      selectedIds.includes(id)
        ? selectedIds.filter((x) => x !== id)
        : [...selectedIds, id]
    );
  };

  const total = totalCount ?? data.length;
  const totalPages = pageSize ? Math.max(1, Math.ceil(total / pageSize)) : 1;
  const currentPage = page ?? 1;
  const rangeStart = total === 0 ? 0 : (currentPage - 1) * (pageSize || total) + 1;
  const rangeEnd = pageSize
    ? Math.min(currentPage * pageSize, total)
    : total;
  const goToPage = (next) => {
    const clamped = Math.min(Math.max(1, next), totalPages);
    onPageChange?.(clamped);
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
      setScrollTop(0);
    }
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-white">
      <div
        ref={containerRef}
        className="min-h-0 flex-1 overflow-x-auto overflow-y-auto"
        onScroll={(e) => setScrollTop(e.target.scrollTop)}
      >
        <table className="w-full table-fixed">
            <colgroup>
              {onSelectChange && <col style={SELECT_COL_STYLE} />}
              {columns.map((col) => (
                <col key={col.key} style={{ width: col.width }} />
              ))}
            </colgroup>
            <thead className="sticky top-0 z-10 bg-white shadow-[0_1px_0_0_rgb(226,232,240)]">
              <tr>
                {onSelectChange && (
                  <th className={SELECT_HEADER_CLASS} style={SELECT_COL_STYLE}>
                    <div className="flex w-fit items-center">
                      <Checkbox
                        checked={allSelected}
                        indeterminate={someSelected}
                        onChange={toggleAll}
                        containerProps={CHECKBOX_CONTAINER_PROPS}
                        crossOrigin=""
                      />
                    </div>
                  </th>
                )}
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={`${DATA_HEADER_CLASS} ${col.align === "center" ? "text-center" : ""}`}
                    style={{ width: col.width }}
                  >
                    {col.filter || (
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                        {col.header}
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan={colSpan} className="h-48 text-center text-slate-400">
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                <>
              {topSpacer > 0 && (
                <tr aria-hidden="true">
                  <td colSpan={colSpan} style={{ height: topSpacer, padding: 0, border: 0 }} />
                </tr>
              )}
              {visibleRows.map((row) => {
                const rowId = row[idKey];
                const isSelected = selectedIds.includes(rowId);
                return (
                  <tr
                    key={rowId}
                    className={`border-b border-slate-100 transition-colors hover:bg-blue-50/50 ${
                      onRowClick ? "cursor-pointer" : ""
                    } ${isSelected ? "bg-blue-50" : "bg-white"}`}
                    style={{ height: rowHeight }}
                    onClick={() => onRowClick?.(row)}
                  >
                    {onSelectChange && (
                      <td className={SELECT_CELL_CLASS} style={SELECT_COL_STYLE}>
                        <div className="flex w-fit items-center">
                          <Checkbox
                            checked={isSelected}
                            onChange={(e) => {
                              e.stopPropagation();
                              toggleRow(rowId);
                            }}
                            containerProps={CHECKBOX_CONTAINER_PROPS}
                            crossOrigin=""
                          />
                        </div>
                      </td>
                    )}
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={`${DATA_CELL_CLASS} ${col.align === "center" ? "text-center" : ""}`}
                        style={{ width: col.width }}
                      >
                        <div className={`min-w-0 overflow-hidden ${col.align === "center" ? "flex justify-center" : ""}`}>
                          {col.render ? col.render(row) : row[col.key]}
                        </div>
                      </td>
                    ))}
                  </tr>
                );
              })}
              {bottomSpacer > 0 && (
                <tr aria-hidden="true">
                  <td colSpan={colSpan} style={{ height: bottomSpacer, padding: 0, border: 0 }} />
                </tr>
              )}
                </>
              )}
            </tbody>
          </table>
      </div>
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-white px-4 py-2">
        <p className="text-xs text-slate-500">
          {pageSize
            ? `Showing ${rangeStart.toLocaleString()}–${rangeEnd.toLocaleString()} of ${total.toLocaleString()}`
            : `Showing ${data.length.toLocaleString()} records`}
          {selectedIds.length > 0 && ` · ${selectedIds.length} selected`}
        </p>
        {pageSize && onPageChange && totalPages > 1 && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage <= 1}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Previous page"
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </button>
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              let pageNum;
              if (totalPages <= 7) {
                pageNum = i + 1;
              } else if (currentPage <= 4) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 3) {
                pageNum = totalPages - 6 + i;
              } else {
                pageNum = currentPage - 3 + i;
              }
              return (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => goToPage(pageNum)}
                  className={`flex h-8 min-w-[32px] items-center justify-center rounded-lg px-2 text-xs font-semibold ${
                    currentPage === pageNum
                      ? "bg-blue-100 text-blue-800 ring-1 ring-blue-300"
                      : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Next page"
            >
              <ChevronRightIcon className="h-4 w-4" />
            </button>
            <span className="ml-2 text-xs text-slate-500">{pageSize} per page</span>
          </div>
        )}
        {pageSize && onPageChange && totalPages === 1 && (
          <span className="text-xs text-slate-500">{pageSize} per page</span>
        )}
      </div>
    </div>
  );
}

VirtualTable.propTypes = {
  data: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  rowHeight: PropTypes.number,
  onRowClick: PropTypes.func,
  selectedIds: PropTypes.array,
  onSelectChange: PropTypes.func,
  idKey: PropTypes.string,
  emptyMessage: PropTypes.string,
  page: PropTypes.number,
  pageSize: PropTypes.number,
  totalCount: PropTypes.number,
  onPageChange: PropTypes.func,
};

export default VirtualTable;
