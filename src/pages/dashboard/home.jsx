import { Typography } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import {
  CubeIcon,
  RectangleStackIcon,
  TruckIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/solid";
import { KpiCard, PageCard, StatusBadge } from "@/components/ui";
import { BrandDivergingChart } from "@/components/charts/BrandDivergingChart";
import { getWarehouseData } from "@/data/warehouse";
import { useAuth } from "@/context/auth";

export function Home() {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const data = getWarehouseData();
  const { kpis, primaryBrands, toProcessByBrand, inventorySummary, batchCounts } = data;

  const toProcessCounts = toProcessByBrand.map((b) => b.count);

  const goToOrders = (queue) => {
    navigate(`/dashboard/orders?queue=${queue}`);
  };

  const batchCards = [
    { label: "Qty 1 batches", value: batchCounts.singleQty1, queue: "single-qty1" },
    { label: "Qty 2 batches", value: batchCounts.singleQty2, queue: "single-qty2" },
    { label: "Qty 3+ batches", value: batchCounts.singleQty3, queue: "single-qty3" },
    { label: "Multiline Orders", value: batchCounts.multiSku, queue: "multi-line" },
  ];

  const kpiCards = [
    {
      icon: CubeIcon,
      title: "Total SKU",
      value: kpis.totalSku,
      trend: kpis.trends.totalSku,
      tooltip: "View all orders for today",
      queue: "all",
    },
    {
      icon: TruckIcon,
      title: "Unshipped Orders",
      value: kpis.unshippedOrders,
      trend: kpis.trends.unshipped,
      tooltip: "Filter unshipped orders",
      queue: "unshipped",
    },
    {
      icon: ShoppingCartIcon,
      title: "Singleline Orders",
      value: kpis.singleOrders,
      trend: kpis.trends.singleOrders,
      tooltip: "Filter single line orders",
      queue: "single-line",
    },
    {
      icon: RectangleStackIcon,
      title: "Multiline Orders",
      value: kpis.multiOrders,
      trend: kpis.trends.multiOrders,
      tooltip: "Filter multi line orders",
      queue: "multi-line",
    },
  ];

  return (
    <div className="space-y-4 animate-fade-in">
      <Typography className="text-xl font-semibold text-slate-900">Today's Operations</Typography>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {batchCards.map(({ label, value, queue }) => (
          <button
            key={label}
            type="button"
            onClick={() => goToOrders(queue)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-left shadow-sm transition-all hover:border-slate-300 hover:shadow-md"
          >
            <Typography className="text-xs text-slate-500">{label}</Typography>
            <Typography className="text-base text-slate-900">{value}</Typography>
          </button>
        ))}
      </div>

      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
        {kpiCards.map(({ icon, title, value, trend, tooltip, queue }) => (
          <KpiCard
            key={title}
            icon={icon}
            title={title}
            value={value}
            trend={isAdmin ? trend : undefined}
            tooltip={tooltip}
            onClick={() => goToOrders(queue)}
          />
        ))}
      </div>

      <PageCard compact title="Orders By Brand" subtitle="Unshipped and ready orders to process — by brand">
        <BrandDivergingChart brands={primaryBrands} toProcessCounts={toProcessCounts} />
      </PageCard>

      <PageCard compact title="Inventory Summary">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b border-slate-100">
                {["Brand", "SKU Count", "Available", "Reserved", "Low Stock"].map((h) => (
                  <th key={h} className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {inventorySummary.map((row) => (
                <tr key={row.brand} className="border-b border-slate-50 transition-colors hover:bg-slate-50">
                  <td className="px-3 py-2 text-sm text-slate-700">{row.brand}</td>
                  <td className="px-3 py-2 text-sm text-slate-600">{row.skuCount.toLocaleString()}</td>
                  <td className="px-3 py-2 text-sm text-slate-600">{row.available.toLocaleString()}</td>
                  <td className="px-3 py-2 text-sm text-slate-600">{row.reserved.toLocaleString()}</td>
                  <td className="px-3 py-2">
                    <StatusBadge label={`${row.lowStock} SKUs`} color={row.lowStock > 10 ? "red" : row.lowStock > 5 ? "yellow" : "green"} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PageCard>
    </div>
  );
}

export default Home;
