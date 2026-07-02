import { useMemo } from "react";
import PropTypes from "prop-types";
import { Typography, Button } from "@material-tailwind/react";
import { VirtualTable, StatusBadge } from "@/components/ui";
import { TableColumnFilter } from "@/components/orders/TableColumnFilter";
import { ORDER_STATUSES } from "@/data/warehouse/constants";

export function PickBySkuView({
  groups,
  totalCount,
  page,
  pageSize,
  onPageChange,
  columnFilters = {},
  onColumnFilterChange,
  onPickSku,
  onSelectOrders,
}) {
  const columns = useMemo(
    () => [
      {
        key: "item",
        header: "Order Item",
        width: "30%",
        render: (row) => (
          <div className="min-w-0 overflow-hidden">
            <Typography className="truncate text-sm text-slate-800">{row.name}</Typography>
            <Typography className="truncate text-xs text-slate-500">
              {row.brand} · {row.productType}
            </Typography>
          </div>
        ),
      },
      {
        key: "sku",
        header: "SKU",
        width: "15%",
        render: (row) => (
          <Typography className="truncate font-mono text-xs text-slate-600">{row.sku}</Typography>
        ),
      },
      {
        key: "variation",
        header: "Variation",
        width: "12%",
        render: (row) => (
          <Typography className="truncate text-xs text-slate-700">
            {row.size} · {row.color}
          </Typography>
        ),
      },
      {
        key: "bin",
        header: "Bin",
        width: "8%",
        render: (row) => (
          <Typography className="truncate font-mono text-xs text-slate-500">{row.location}</Typography>
        ),
      },
      {
        key: "qty",
        header: "Quantity",
        width: "8%",
        filter: (
          <TableColumnFilter
            label="Quantity"
            value={columnFilters.qty || ""}
            onChange={(v) => onColumnFilterChange?.("qty", v)}
            options={[
              { value: "", label: "All qty" },
              { value: "1", label: "Qty 1" },
              { value: "2", label: "Qty 2" },
              { value: "3+", label: "Qty 3+" },
              { value: "multi", label: "Multi line" },
            ]}
          />
        ),
        render: (row) => (
          <Typography className="truncate text-sm text-slate-700">
            {row.totalQty}
            <span className="mx-1 text-slate-300">·</span>
            <span className="text-slate-500">{row.orderCount} orders</span>
          </Typography>
        ),
      },
      {
        key: "status",
        header: "Status",
        width: "13%",
        filter: (
          <TableColumnFilter
            label="Status"
            value={columnFilters.status || ""}
            onChange={(v) => onColumnFilterChange?.("status", v)}
            options={[
              { value: "", label: "All status" },
              ...ORDER_STATUSES.map((s) => ({ value: s.key, label: s.label })),
            ]}
          />
        ),
        render: (row) =>
          row.statuses.includes("unshipped") ? (
            <StatusBadge label="Unshipped" color="red" />
          ) : (
            <Typography className="text-xs text-slate-400">—</Typography>
          ),
      },
      {
        key: "actions",
        header: "",
        width: "14%",
        align: "center",
        render: (row) => (
          <Button
            size="sm"
            color="blue"
            variant="outlined"
            className="whitespace-nowrap normal-case"
            onClick={(e) => {
              e.stopPropagation();
              onPickSku?.(row.sku);
              onSelectOrders?.(row.orderIds);
            }}
          >
            Pick batch ({row.orderCount})
          </Button>
        ),
      },
    ],
    [columnFilters, onColumnFilterChange, onPickSku, onSelectOrders]
  );

  return (
    <VirtualTable
      data={groups}
      columns={columns}
      idKey="sku"
      emptyMessage="No SKUs in this queue. Adjust your date range, batch cards, or column filters."
      page={page}
      pageSize={pageSize}
      totalCount={totalCount}
      onPageChange={onPageChange}
    />
  );
}

PickBySkuView.propTypes = {
  groups: PropTypes.array.isRequired,
  totalCount: PropTypes.number,
  page: PropTypes.number,
  pageSize: PropTypes.number,
  onPageChange: PropTypes.func,
  columnFilters: PropTypes.object,
  onColumnFilterChange: PropTypes.func,
  onPickSku: PropTypes.func,
  onSelectOrders: PropTypes.func,
};

export default PickBySkuView;
