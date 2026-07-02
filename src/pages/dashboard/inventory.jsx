import { useState, useMemo } from "react";
import { Typography, Input } from "@material-tailwind/react";
import {
  CubeIcon, CheckCircleIcon, LockClosedIcon, ExclamationTriangleIcon,
  XCircleIcon, MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";
import { KpiCard, PageCard, StatusBadge, BrandIcon } from "@/components/ui";
import { getWarehouseData } from "@/data/warehouse";

export function Inventory() {
  const { skus, inventoryKpis } = getWarehouseData();
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search) return skus;
    const q = search.toLowerCase();
    return skus.filter(
      (s) =>
        s.sku.toLowerCase().includes(q) ||
        s.asin?.toLowerCase().includes(q) ||
        s.name.toLowerCase().includes(q) ||
        s.brand.toLowerCase().includes(q)
    );
  }, [skus, search]);

  const columns = useMemo(
    () => [
      { key: "brand", header: "Brand", width: "14%", wrap: true },
      { key: "sku", header: "SKU", width: "26%", wrap: true },
      { key: "available", header: "Available", width: "12%", align: "right" },
      { key: "reserved", header: "Reserved", width: "12%", align: "right" },
      { key: "location", header: "Location", width: "14%", wrap: true },
      { key: "status", header: "Status", width: "22%", align: "center" },
    ],
    []
  );

  const brandTotals = useMemo(() => {
    const map = {};
    skus.forEach((s) => {
      if (!map[s.brand]) map[s.brand] = { available: 0, reserved: 0, count: 0 };
      map[s.brand].available += s.available;
      map[s.brand].reserved += s.reserved;
      map[s.brand].count += 1;
    });
    return Object.entries(map)
      .sort((a, b) => b[1].available - a[1].available)
      .slice(0, 10);
  }, [skus]);

  return (
    <div className="space-y-6">
      <div>
        <Typography className="text-2xl font-semibold text-slate-900">Inventory</Typography>
        <Typography className="text-sm text-slate-500">
          Live stock counts — {skus.length.toLocaleString()} SKUs tracked
        </Typography>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <KpiCard icon={CubeIcon} title="Total Units" value={inventoryKpis.total} trend={2.1} tooltip="All units in warehouse" color="blue" />
        <KpiCard icon={CheckCircleIcon} title="Available" value={inventoryKpis.available} trend={1.8} tooltip="Ready to ship" color="green" />
        <KpiCard icon={LockClosedIcon} title="Reserved" value={inventoryKpis.reserved} trend={4.2} tooltip="Reserved for today's orders" color="purple" />
        <KpiCard icon={ExclamationTriangleIcon} title="Low Stock" value={inventoryKpis.lowStock} trend={-3} tooltip="Below reorder threshold" color="orange" />
        <KpiCard icon={XCircleIcon} title="Out of Stock" value={inventoryKpis.outOfStock} trend={-1.2} tooltip="Zero availability" color="red" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <PageCard title="Stock by Brand" className="lg:col-span-1">
          <div className="space-y-2">
            {brandTotals.map(([brand, data]) => (
              <div key={brand} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                <div className="flex items-center gap-2">
                  <BrandIcon brand={brand} size="sm" />
                  <Typography className="text-sm text-slate-700">{brand}</Typography>
                </div>
                <div className="text-right">
                  <Typography className="text-sm text-slate-600">{data.available.toLocaleString()}</Typography>
                  <Typography className="text-xs text-slate-400">{data.count} SKUs</Typography>
                </div>
              </div>
            ))}
          </div>
        </PageCard>

        <PageCard
          title="All Inventory"
          className="lg:col-span-2"
          action={
            <div className="w-56">
              <Input
                icon={<MagnifyingGlassIcon className="h-4 w-4" />}
                label="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                crossOrigin=""
              />
            </div>
          }
        >
          <div className="max-h-[520px] overflow-y-auto">
            <table className="w-full table-fixed border-collapse">
              <colgroup>
                {columns.map((col) => (
                  <col key={col.key} style={{ width: col.width }} />
                ))}
              </colgroup>
              <thead className="sticky top-0 z-10 bg-white">
                <tr className="border-b border-slate-200">
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      className={`px-3 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-400 ${
                        col.align === "right"
                          ? "text-right"
                          : col.align === "center"
                            ? "text-center"
                            : "text-left"
                      }`}
                    >
                      {col.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.slice(0, 100).map((row) => (
                  <tr key={row.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-3 py-2.5 align-top">
                      <span className="block break-words text-sm leading-snug text-slate-700">{row.brand}</span>
                    </td>
                    <td className="px-3 py-2.5 align-top">
                      <span className="block break-all font-mono text-xs leading-snug text-slate-600">{row.sku}</span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-2.5 align-top text-right text-sm tabular-nums text-slate-700">
                      {row.available.toLocaleString()}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2.5 align-top text-right text-sm tabular-nums text-slate-700">
                      {row.reserved.toLocaleString()}
                    </td>
                    <td className="px-3 py-2.5 align-top">
                      <span className="block break-all font-mono text-xs leading-snug text-slate-500">{row.location}</span>
                    </td>
                    <td className="px-3 py-2.5 align-top text-center">
                      <StatusBadge label={row.status.label} color={row.status.color} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Typography className="mt-2 text-xs text-slate-400">
            Showing {Math.min(filtered.length, 100)} of {filtered.length} SKUs
          </Typography>
        </PageCard>
      </div>
    </div>
  );
}

export default Inventory;
