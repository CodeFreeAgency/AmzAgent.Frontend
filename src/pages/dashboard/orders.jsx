import { useState, useMemo, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";

import { Typography, Button, IconButton } from "@material-tailwind/react";

import {
  InformationCircleIcon,
  ArrowDownTrayIcon,
  PrinterIcon,
  CheckCircleIcon,
  ListBulletIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";
import {
  CubeIcon,
  Square2StackIcon,
  RectangleStackIcon,
  QueueListIcon,
} from "@heroicons/react/24/solid";

import { VirtualTable, StatusBadge, PageCard, DateRangeChips, OrderSearchInput } from "@/components/ui";

import { OrderDrawer } from "@/components/orders/OrderDrawer";

import { ActiveFilterBar } from "@/components/orders/ActiveFilterBar";

import { TableColumnFilter } from "@/components/orders/TableColumnFilter";

import { BatchFilterCard } from "@/components/orders/BatchFilterCard";

import { OrderItemCell } from "@/components/orders/OrderItemCell";

import { PickBySkuView } from "@/components/orders/PickBySkuView";

import { BulkActionsBar } from "@/components/orders/BulkActionsBar";

import {

  DEFAULT_FILTERS,

  filterOrders,

  applyBatchFilter,

  filtersFromQueueParam,

  groupOrdersBySku,

} from "@/components/orders/orderFilterUtils";

import { useOrdersWorkspace } from "@/hooks/useOrdersWorkspace";

import { useOrderSearch } from "@/context/orderSearch";

import { useAuth } from "@/context/auth";

import { ORDER_STATUSES } from "@/data/warehouse/constants";



const PAGE_SIZE = 50;



const BATCH_CARDS = [
  { key: "1", label: "Single SKU · Qty 1", icon: CubeIcon, tooltip: "Single-item orders with quantity 1" },
  { key: "2", label: "Single SKU · Qty 2", icon: Square2StackIcon, tooltip: "Single-item orders with quantity 2" },
  { key: "3+", label: "Single SKU · Qty 3+", icon: QueueListIcon, tooltip: "Single-item orders with quantity 3 or more" },
  { key: "multi", label: "Multiline Orders", icon: RectangleStackIcon, tooltip: "Orders with multiple line items" },
];

const viewToggleClass = (active) =>
  active
    ? "bg-blue-100 text-blue-800 ring-1 ring-blue-300"
    : "text-slate-600 hover:bg-slate-50";



export function Orders() {
  const { isAdmin } = useAuth();

  const {

    orders,

    labelQueue,

    needsReview,

    reviewOrders,

    batchCounts,

    generateLabel,

    markPacked,

    uploadToAmazon,

    confirmStaff,

    resolveReview,

    bulkGenerateLabels,

    bulkMarkPacked,

    bulkUploadToAmazon,

    downloadLabel,

    printLabel,

  } = useOrdersWorkspace();

  const [searchParams, setSearchParams] = useSearchParams();

  const { applied: appliedSearch, clearSearch, setAppliedSearch } = useOrderSearch();

  const [activeTab, setActiveTab] = useState("orders");

  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const [selectedIds, setSelectedIds] = useState([]);

  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const [viewMode, setViewMode] = useState("list");

  const [page, setPage] = useState(1);



  const selectedOrder = useMemo(

    () => (selectedOrderId ? orders.find((o) => o.id === selectedOrderId) ?? null : null),

    [orders, selectedOrderId]

  );



  useEffect(() => {
    setFilters((prev) => (prev.search === appliedSearch ? prev : { ...prev, search: appliedSearch }));
    if (appliedSearch) {
      setActiveTab("orders");
      setViewMode("list");
      setPage(1);
    }
  }, [appliedSearch]);

  useEffect(() => {
    if (!isAdmin) {
      setFilters((prev) => (prev.dateRange === "today" ? prev : { ...prev, dateRange: "today" }));
    }
  }, [isAdmin]);

  const filteredOrders = useMemo(() => filterOrders(orders, filters), [orders, filters]);

  const skuGroups = useMemo(() => groupOrdersBySku(filteredOrders), [filteredOrders]);



  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE));

  const paginatedOrders = useMemo(() => {

    const start = (page - 1) * PAGE_SIZE;

    return filteredOrders.slice(start, start + PAGE_SIZE);

  }, [filteredOrders, page]);

  const paginatedSkuGroups = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return skuGroups.slice(start, start + PAGE_SIZE);
  }, [skuGroups, page]);



  useEffect(() => {
    const queue = searchParams.get("queue");
    if (!queue) return;

    const nextFilters = filtersFromQueueParam(queue);
    if (nextFilters) {
      clearSearch();
      setFilters(nextFilters);
      setActiveTab("orders");
      setViewMode("list");
      setSelectedIds([]);
      setPage(1);
    }

    setSearchParams({}, { replace: true });
  }, [searchParams, setSearchParams, clearSearch]);

  useEffect(() => {

    setPage(1);

  }, [filters, viewMode, activeTab]);



  useEffect(() => {

    if (page > totalPages) setPage(totalPages);

  }, [page, totalPages]);



  const handleFiltersChange = useCallback(
    (next) => {
      if (!next.search && appliedSearch) clearSearch();
      setFilters(isAdmin ? next : { ...next, dateRange: "today" });
    },
    [appliedSearch, clearSearch, isAdmin]
  );

  const handleBatchClick = (key) => {

    const isActive = filters.preset === (key === "multi" ? "multi-line" : `single-qty${key === "3+" ? "3" : key}`);

    clearSearch();
    setFilters(isActive ? DEFAULT_FILTERS : applyBatchFilter(key));

    setSelectedIds([]);

  };



  const updateColumnFilter = useCallback((key, value) => {
    clearSearch();
    setFilters((prev) => ({
      ...prev,
      columnFilters: { ...prev.columnFilters, [key]: value },
      preset: null,
    }));
  }, [clearSearch]);

  const handlePickSku = (sku) => {
    setAppliedSearch(sku);
    setFilters((prev) => ({
      ...prev,
      sort: "sku",
      preset: null,
    }));
    setViewMode("list");
  };



  const handleSelectAllVisible = () => {

    if (selectedIds.length === filteredOrders.length) {

      setSelectedIds([]);

    } else {

      setSelectedIds(filteredOrders.map((o) => o.id));

    }

  };



  const openOrder = useCallback((order) => {

    setSelectedOrderId(order.id);

  }, []);



  const columnFilters = filters.columnFilters || {};

  const columns = useMemo(
    () => [
      {
        key: "id",
        header: "Order ID",
        width: "9%",
        render: (row) => (
          <Typography className="truncate text-sm text-blue-600">{row.id}</Typography>
        ),
      },
      {
        key: "item",
        header: "Order Item",
        width: "30%",
        render: (row) => (
          <OrderItemCell item={row.items[0]} extraItems={row.items.length > 1 ? row.items.length - 1 : 0} />
        ),
      },
      {
        key: "sku",
        header: "SKU",
        width: "15%",
        render: (row) => (
          <Typography className="truncate font-mono text-xs text-slate-600">{row.items[0].sku}</Typography>
        ),
      },
      {
        key: "bin",
        header: "Bin",
        width: "7%",
        render: (row) => (
          <Typography className="truncate font-mono text-xs text-slate-500">{row.items[0].location}</Typography>
        ),
      },
      {
        key: "qty",
        header: "Quantity",
        width: "7%",
        filter: (
          <TableColumnFilter
            label="Quantity"
            value={columnFilters.qty || ""}
            onChange={(v) => updateColumnFilter("qty", v)}
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
          <Typography className="text-sm text-slate-700">
            {row.items.reduce((s, i) => s + i.qty, 0)}
          </Typography>
        ),
      },
      {
        key: "createdOn",
        header: "Created",
        width: "11%",
        render: (row) => (
          <Typography className="truncate text-xs text-slate-700">
            {row.createdOn}
            <span className="mx-1 text-slate-300">·</span>
            <span className="text-slate-400">{row.createdTime}</span>
          </Typography>
        ),
      },
      {
        key: "status",
        header: "Status",
        width: "14%",
        filter: (
          <TableColumnFilter
            label="Status"
            value={columnFilters.status || ""}
            onChange={(v) => updateColumnFilter("status", v)}
            options={[
              { value: "", label: "All status" },
              ...ORDER_STATUSES.map((s) => ({ value: s.key, label: s.label })),
            ]}
          />
        ),
        render: (row) => (
          <div className="flex min-w-0 items-center gap-2">
            <StatusBadge label={row.status.label} color={row.status.color} />
            <Typography className="shrink-0 text-[11px] text-slate-400">{row.statusTime}</Typography>
          </div>
        ),
      },
      {
        key: "actions",
        header: "",
        width: "4%",
        align: "center",
        render: (row) => (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              openOrder(row);
            }}
            title="View order details"
            aria-label={`View details for ${row.id}`}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-blue-50 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            <InformationCircleIcon className="h-5 w-5" strokeWidth={1.75} />
          </button>
        ),
      },

    ],

    [columnFilters, openOrder, updateColumnFilter]
  );



  const batchCountMap = {

    "1": batchCounts.singleQty1,

    "2": batchCounts.singleQty2,

    "3+": batchCounts.singleQty3,

    multi: batchCounts.multiSku,

  };



  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Typography className="shrink-0 text-2xl font-semibold text-slate-900">Orders</Typography>
        <OrderSearchInput size="medium" className="shrink-0" />
        <DateRangeChips
          value={filters.dateRange}
          todayOnly={!isAdmin}
          onChange={(range) => setFilters((prev) => ({ ...prev, dateRange: range }))}
        />
        <div className="ml-auto inline-flex shrink-0 rounded-xl border border-slate-200 bg-white p-0.5 shadow-sm">
          <button
            type="button"
            onClick={() => setViewMode("list")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold ${viewToggleClass(viewMode === "list")}`}
          >
            <ListBulletIcon className="h-4 w-4 text-current" />
            Order List
          </button>
          <button
            type="button"
            onClick={() => setViewMode("sku")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold ${viewToggleClass(viewMode === "sku")}`}
          >
            <Squares2X2Icon className="h-4 w-4 text-current" />
            Pick by SKU
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {BATCH_CARDS.map(({ key, label, icon, tooltip }) => {
          const presetKey = key === "multi" ? "multi-line" : `single-qty${key === "3+" ? "3" : key}`;
          const isActive = filters.preset === presetKey;
          return (
            <BatchFilterCard
              key={key}
              icon={icon}
              title={label}
              value={batchCountMap[key]}
              active={isActive}
              tooltip={tooltip}
              onClick={() => handleBatchClick(key)}
            />
          );
        })}
      </div>

      <div className="flex min-h-[calc(100vh-16rem)] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <ActiveFilterBar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          reviewCount={reviewOrders.length}
          filters={filters}
          onChange={handleFiltersChange}
          resultCount={filteredOrders.length}
          onSelectAll={handleSelectAllVisible}
          selectedCount={selectedIds.length}
          bulkActions={
            <BulkActionsBar
              count={selectedIds.length}
              onBulkLabel={() => bulkGenerateLabels(selectedIds)}
              onBulkPack={() => bulkMarkPacked(selectedIds)}
              onBulkUpload={() => bulkUploadToAmazon(selectedIds)}
              onClear={() => setSelectedIds([])}
            />
          }
        />

        {activeTab === "orders" && (
          viewMode === "sku" ? (
            <PickBySkuView
              groups={paginatedSkuGroups}
              totalCount={skuGroups.length}
              page={page}
              pageSize={PAGE_SIZE}
              onPageChange={setPage}
              columnFilters={columnFilters}
              onColumnFilterChange={updateColumnFilter}
              onPickSku={handlePickSku}
              onSelectOrders={setSelectedIds}
            />
          ) : (
            <VirtualTable
              data={paginatedOrders}
              columns={columns}
              selectedIds={selectedIds}
              onSelectChange={setSelectedIds}
              idKey="id"
              page={page}
              pageSize={PAGE_SIZE}
              totalCount={filteredOrders.length}
              onPageChange={setPage}
            />
          )
        )}

        {activeTab === "dhl" && (
        <div className="space-y-4 p-4">

          <PageCard title="DHL Label Queue" subtitle="Generate, confirm, download, and print shipping labels">

            <div className="overflow-x-auto">

              <table className="w-full min-w-[800px]">

                <thead>

                  <tr className="border-b border-slate-100">

                    {["Order ID", "Product", "SKU", "Weight", "Country", "Tracking ID", "Status", "Staff OK", "Actions"].map((h) => (

                      <th key={h} className="px-3 py-2 text-left text-xs font-semibold uppercase text-slate-400">{h}</th>

                    ))}

                  </tr>

                </thead>

                <tbody>

                  {labelQueue.slice(0, 20).map((row) => (

                    <tr key={row.orderId} className="border-b border-slate-50 hover:bg-slate-50">

                      <td className="px-3 py-2.5">

                        <button

                          type="button"

                          onClick={() => openOrder(row.order)}

                          className="text-sm text-blue-600 hover:underline"

                        >

                          {row.orderId}

                        </button>

                      </td>

                      <td className="max-w-[160px] truncate px-3 py-2.5 text-sm text-slate-700">{row.productName}</td>

                      <td className="px-3 py-2.5 text-xs font-mono text-slate-500">{row.sku}</td>

                      <td className="px-3 py-2.5 text-sm">{row.weight} kg</td>

                      <td className="px-3 py-2.5 text-sm">{row.country}</td>

                      <td className="px-3 py-2.5 font-mono text-xs text-blue-600">{row.trackingId || "—"}</td>

                      <td className="px-3 py-2.5">

                        <StatusBadge label={row.status} color={row.status === "Generated" || row.status === "Uploaded" ? "blue" : row.status === "Failed" ? "red" : "yellow"} />

                      </td>

                      <td className="px-3 py-2.5">

                        {row.order.staffConfirmed ? (

                          <CheckCircleIcon className="h-5 w-5 text-emerald-500" />

                        ) : (

                          <Button

                            size="sm"

                            variant="outlined"

                            className="normal-case py-1 text-xs"

                            onClick={() => confirmStaff(row.orderId)}

                          >

                            Confirm

                          </Button>

                        )}

                      </td>

                      <td className="px-3 py-2.5">

                        <div className="flex gap-1">

                          {!row.trackingId ? (

                            <Button

                              size="sm"

                              color="blue"

                              className="normal-case py-1 text-xs"

                              onClick={() => generateLabel(row.orderId)}

                            >

                              Generate

                            </Button>

                          ) : (

                            <>

                              <IconButton

                                variant="text"

                                size="sm"

                                onClick={() => downloadLabel(row.order)}

                                title="Download label"

                              >

                                <ArrowDownTrayIcon className="h-4 w-4" />

                              </IconButton>

                              <IconButton

                                variant="text"

                                size="sm"

                                onClick={() => printLabel(row.order)}

                                title="Print label"

                              >

                                <PrinterIcon className="h-4 w-4" />

                              </IconButton>

                            </>

                          )}

                        </div>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </PageCard>

        </div>
        )}

        {activeTab === "review" && (
        <div className="grid gap-4 p-4 lg:grid-cols-2">

          {needsReview.filter((n) => n.count > 0).map((item) => (

            <PageCard key={item.key} title={item.label}>

              <div className="mb-3 flex items-center justify-between">

                <StatusBadge

                  label={`${item.count} orders`}

                  color={item.severity === "critical" ? "red" : item.severity === "high" ? "orange" : "yellow"}

                />

              </div>

              <div className="space-y-2">

                {(item.orders || []).map((o) => (

                  <button

                    key={o.id}

                    type="button"

                    onClick={() => openOrder(o)}

                    className="flex w-full items-center justify-between rounded-lg border border-slate-100 px-3 py-2 text-left hover:bg-slate-50"

                  >

                    <span className="text-sm text-blue-600">{o.id}</span>

                    <span className="text-xs text-slate-500">{o.brand} · {o.items[0].sku}</span>

                  </button>

                ))}

              </div>

            </PageCard>

          ))}

        </div>
        )}
      </div>

      <OrderDrawer

        order={selectedOrder}

        open={!!selectedOrder}

        onClose={() => setSelectedOrderId(null)}

        onGenerateLabel={generateLabel}

        onMarkPacked={markPacked}

        onUploadToAmazon={uploadToAmazon}

        onResolveReview={resolveReview}

      />

    </div>

  );

}



export default Orders;

