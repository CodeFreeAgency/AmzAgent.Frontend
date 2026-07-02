import { CLOTHING_CATEGORIES, ORDER_STATUSES, PICK_QUEUE_PRESETS } from "@/data/warehouse/constants";

export const DEFAULT_COLUMN_FILTERS = {
  qty: "",
  status: "",
};

export const DEFAULT_FILTERS = {
  search: "",
  columnFilters: { ...DEFAULT_COLUMN_FILTERS },
  sort: "priority",
  dateRange: "today",
  orderType: "all",
  brands: [],
  statuses: [],
  qtyGroup: "all",
  sizes: [],
  colors: [],
  categories: [],
  preset: null,
  hasTracking: null,
};

export function filterByDate(orders, range) {
  const now = new Date();
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  if (range === "today") return orders.filter((o) => o.createdAt >= start);
  if (range === "yesterday") {
    start.setDate(start.getDate() - 1);
    const end = new Date(start);
    end.setHours(23, 59, 59);
    return orders.filter((o) => o.createdAt >= start && o.createdAt <= end);
  }
  if (range === "7days") {
    start.setDate(start.getDate() - 7);
    return orders.filter((o) => o.createdAt >= start);
  }
  if (range === "30days") {
    start.setDate(start.getDate() - 30);
    return orders.filter((o) => o.createdAt >= start);
  }
  return orders;
}

function matchesSearch(order, query) {
  const q = query.toLowerCase();
  return (
    order.id.toLowerCase().includes(q) ||
    order.amazonOrderId?.toLowerCase().includes(q) ||
    order.trackingId?.toLowerCase().includes(q) ||
    order.brand?.toLowerCase().includes(q) ||
    order.items.some(
      (i) =>
        i.sku.toLowerCase().includes(q) ||
        i.name.toLowerCase().includes(q) ||
        i.brand?.toLowerCase().includes(q) ||
        i.size?.toLowerCase().includes(q) ||
        i.color?.toLowerCase().includes(q) ||
        i.productType?.toLowerCase().includes(q) ||
        i.location?.toLowerCase().includes(q)
    )
  );
}

function matchesCategory(item, categories) {
  if (!categories?.length) return true;
  return CLOTHING_CATEGORIES.some(
    (cat) => categories.includes(cat.key) && cat.types.includes(item.productType)
  );
}

function orderMatchesClothingFilters(order, filters) {
  const primary = order.items[0];
  if (filters.sizes?.length && !filters.sizes.includes(primary.size)) return false;
  if (filters.colors?.length && !filters.colors.includes(primary.color)) return false;
  if (filters.categories?.length && !matchesCategory(primary, filters.categories)) return false;
  return true;
}

function matchesColumnFilters(order, columnFilters = {}) {
  if (columnFilters.qty) {
    if (columnFilters.qty === "multi" && order.orderType !== "multi") return false;
    if (columnFilters.qty !== "multi") {
      if (order.orderType !== "single" || order.qtyGroup !== columnFilters.qty) return false;
    }
  }
  if (columnFilters.status && order.status.key !== columnFilters.status) {
    return false;
  }
  return true;
}

function hasActiveColumnFilters(columnFilters = {}) {
  return Object.values(columnFilters).some(Boolean);
}

export function filterOrders(orders, filters) {
  let result = filterByDate([...orders], filters.dateRange);

  if (filters.search) {
    result = result.filter((o) => matchesSearch(o, filters.search));
  }
  if (filters.columnFilters && hasActiveColumnFilters(filters.columnFilters)) {
    result = result.filter((o) => matchesColumnFilters(o, filters.columnFilters));
  }

  if (filters.orderType !== "all") {
    result = result.filter((o) => o.orderType === filters.orderType);
  }
  if (filters.brands?.length) {
    result = result.filter((o) => filters.brands.includes(o.brand));
  }
  if (filters.statuses?.length) {
    result = result.filter((o) => filters.statuses.includes(o.status.key));
  }
  if (filters.qtyGroup !== "all") {
    result = result.filter((o) => o.qtyGroup === filters.qtyGroup);
  }
  if (filters.hasTracking === false) {
    result = result.filter((o) => !o.trackingId);
  }
  if (filters.hasTracking === true) {
    result = result.filter((o) => !!o.trackingId);
  }

  result = result.filter((o) => orderMatchesClothingFilters(o, filters));

  if (filters.sort === "oldest") {
    result.sort((a, b) => a.createdAt - b.createdAt);
  } else if (filters.sort === "newest") {
    result.sort((a, b) => b.createdAt - a.createdAt);
  } else if (filters.sort === "status") {
    const order = ["unshipped", "ready", "packed", "dispatched"];
    result.sort((a, b) => order.indexOf(a.status.key) - order.indexOf(b.status.key));
  } else if (filters.sort === "priority") {
    const statusWeight = { unshipped: 0, ready: 1, packed: 2, dispatched: 3 };
    const qtyWeight = { 1: 0, 2: 1, "3+": 2, multi: 3 };
    result.sort((a, b) => {
      const sa = statusWeight[a.status.key] ?? 9;
      const sb = statusWeight[b.status.key] ?? 9;
      if (sa !== sb) return sa - sb;
      const qa = a.orderType === "multi" ? 3 : qtyWeight[a.qtyGroup] ?? 9;
      const qb = b.orderType === "multi" ? 3 : qtyWeight[b.qtyGroup] ?? 9;
      if (qa !== qb) return qa - qb;
      return b.createdAt - a.createdAt;
    });
  } else if (filters.sort === "sku") {
    result.sort((a, b) => a.items[0].sku.localeCompare(b.items[0].sku));
  } else if (filters.sort === "location") {
    result.sort((a, b) => (a.items[0].location || "").localeCompare(b.items[0].location || ""));
  }

  return result;
}

export function countOrdersForPreset(orders, presetKey, dateRange = "today") {
  const preset = PICK_QUEUE_PRESETS.find((p) => p.key === presetKey);
  if (!preset) return 0;
  return filterOrders(orders, {
    ...DEFAULT_FILTERS,
    dateRange,
    ...preset.filters,
    preset: presetKey,
  }).length;
}

export function applyPreset(presetKey) {
  const preset = PICK_QUEUE_PRESETS.find((p) => p.key === presetKey);
  if (!preset) return DEFAULT_FILTERS;
  return {
    ...DEFAULT_FILTERS,
    sort: "priority",
    ...preset.filters,
    preset: presetKey,
  };
}

export function applyBatchFilter(qtyGroup) {
  if (qtyGroup === "multi") {
    return applyPreset("multi-line");
  }
  const presetKey = qtyGroup === "3+" ? "single-qty3" : `single-qty${qtyGroup}`;
  return applyPreset(presetKey);
}

/** Map dashboard / URL shortcut keys to orders filter state */
export function filtersFromQueueParam(queue) {
  switch (queue) {
    case "single-qty1":
      return applyBatchFilter("1");
    case "single-qty2":
      return applyBatchFilter("2");
    case "single-qty3":
      return applyBatchFilter("3+");
    case "multi-line":
      return applyBatchFilter("multi");
    case "unshipped":
      return { ...DEFAULT_FILTERS, statuses: ["unshipped"] };
    case "single-line":
      return { ...DEFAULT_FILTERS, orderType: "single" };
    case "all":
      return { ...DEFAULT_FILTERS };
    default:
      return null;
  }
}

export function groupOrdersBySku(orders) {
  const map = new Map();
  orders.forEach((order) => {
    order.items.forEach((item) => {
      const existing = map.get(item.sku);
      if (existing) {
        existing.orderCount += 1;
        existing.totalQty += item.qty;
        existing.orderIds.push(order.id);
        if (!existing.statuses.includes(order.status.key)) {
          existing.statuses.push(order.status.key);
        }
      } else {
        map.set(item.sku, {
          sku: item.sku,
          name: item.name,
          brand: item.brand,
          size: item.size,
          color: item.color,
          productType: item.productType,
          location: item.location,
          image: item.image,
          orderCount: 1,
          totalQty: item.qty,
          orderIds: [order.id],
          statuses: [order.status.key],
        });
      }
    });
  });
  return [...map.values()].sort((a, b) => b.totalQty - a.totalQty);
}

const COLUMN_FILTER_LABELS = {
  qty: "Qty",
  status: "Status",
};

export function getActiveFilterLabels(filters) {
  const labels = [];
  if (filters.columnFilters) {
    Object.entries(filters.columnFilters).forEach(([key, value]) => {
      if (!value) return;
      const prefix = COLUMN_FILTER_LABELS[key] || key;
      let displayValue = value;
      if (key === "status") {
        displayValue = ORDER_STATUSES.find((s) => s.key === value)?.label || value;
      } else if (key === "qty" && value === "multi") {
        displayValue = "Multi line";
      }
      labels.push({ key: `column-${key}`, label: `${prefix}: ${displayValue}`, columnKey: key });
    });
  }
  if (filters.search) labels.push({ key: "search", label: `Search: "${filters.search}"` });
  if (filters.preset) {
    const preset = PICK_QUEUE_PRESETS.find((p) => p.key === filters.preset);
    if (preset) labels.push({ key: "preset", label: preset.label });
  }
  if (filters.orderType !== "all") labels.push({ key: "orderType", label: filters.orderType === "single" ? "Singleline Orders" : "Multiline Orders" });
  if (filters.qtyGroup !== "all") labels.push({ key: "qtyGroup", label: `Qty ${filters.qtyGroup}` });
  filters.statuses?.forEach((s) => labels.push({ key: `status-${s}`, label: s.replace("_", " "), group: "statuses", value: s }));
  filters.brands?.forEach((b) => labels.push({ key: `brand-${b}`, label: b, group: "brands", value: b }));
  filters.sizes?.forEach((s) => labels.push({ key: `size-${s}`, label: `Size ${s}`, group: "sizes", value: s }));
  filters.colors?.forEach((c) => labels.push({ key: `color-${c}`, label: c, group: "colors", value: c }));
  filters.categories?.forEach((c) => {
    const cat = CLOTHING_CATEGORIES.find((x) => x.key === c);
    labels.push({ key: `cat-${c}`, label: cat?.label || c, group: "categories", value: c });
  });
  return labels;
}

export function removeFilterChip(filters, chip) {
  const next = { ...filters };
  if (chip.columnKey) {
    next.columnFilters = { ...filters.columnFilters, [chip.columnKey]: "" };
    return next;
  }
  if (chip.key === "search") next.search = "";
  if (chip.key === "preset") {
    next.preset = null;
    return {
      ...DEFAULT_FILTERS,
      dateRange: filters.dateRange,
      search: filters.search,
      columnFilters: { ...filters.columnFilters },
    };
  }
  if (chip.key === "orderType") next.orderType = "all";
  if (chip.key === "qtyGroup") next.qtyGroup = "all";
  if (chip.group && chip.value) {
    next[chip.group] = (next[chip.group] || []).filter((v) => v !== chip.value);
  }
  return next;
}

export { PICK_QUEUE_PRESETS, CLOTHING_CATEGORIES };
