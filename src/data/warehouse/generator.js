import {
  PRIMARY_BRANDS,
  ALL_BRANDS,
  ORDER_STATUSES,
  SHIP_STATUSES,
  INVENTORY_STATUSES,
  STAFF,
  WAREHOUSES,
  WAREHOUSE_ZONES,
  COUNTRIES,
  REVIEW_REASONS,
  TIMELINE_EVENTS,
  PRODUCT_TYPES,
  CLOTHING_SIZES,
  CLOTHING_COLORS,
} from "./constants";

/** Client operates ~500 FBM orders per day */
const DAILY_ORDER_VOLUME = 500;
const ORDER_HISTORY_DAYS = 3;
const TOTAL_ORDERS = DAILY_ORDER_VOLUME * ORDER_HISTORY_DAYS;
const SKU_COUNT = 1200;

const BRAND_COLORS = {
  Nike: "#111827", Adidas: "#1e3a5f", Puma: "#c2410c", Reebok: "#dc2626",
  "New Balance": "#15803d", "Under Armour": "#1d4ed8",
};

function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function pick(rand, arr) {
  return arr[Math.floor(rand() * arr.length)];
}

function pickWeighted(rand, items, weights) {
  const total = weights.reduce((a, b) => a + b, 0);
  let r = rand() * total;
  for (let i = 0; i < items.length; i++) {
    r -= weights[i];
    if (r <= 0) return items[i];
  }
  return items[items.length - 1];
}

function randomDateRecent(rand, maxDaysAgo = ORDER_HISTORY_DAYS) {
  const now = Date.now();
  const dayWeight = rand();
  const daysAgo = dayWeight < 0.55 ? 0 : dayWeight < 0.85 ? 1 : maxDaysAgo - 1;
  const dayMs = 24 * 60 * 60 * 1000;
  const offset = daysAgo * dayMs + Math.floor(rand() * dayMs);
  return new Date(now - offset);
}

function formatDate(d) {
  return d.toISOString().split("T")[0];
}

function formatTime(d) {
  return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

function generateDHLTracking(rand) {
  return `${Math.floor(rand() * 9) + 1}${String(Math.floor(rand() * 1e9)).padStart(9, "0")}${Math.floor(rand() * 9) + 1}`;
}

function processingTime(rand) {
  const mins = Math.floor(rand() * 180) + 10;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function inventoryStatus(available) {
  if (available === 0) return INVENTORY_STATUSES[3];
  if (available < 5) return INVENTORY_STATUSES[2];
  if (available < 20) return INVENTORY_STATUSES[1];
  return INVENTORY_STATUSES[0];
}

function statusTimestamp(createdAt, statusKey, rand) {
  const offsets = { unshipped: 0, ready: 1, packed: 3, dispatched: 6 };
  const hours = (offsets[statusKey] || 0) + rand() * 2;
  return new Date(createdAt.getTime() + hours * 3600000);
}

export function generateWarehouseData() {
  const rand = seededRandom(42);
  const skus = [];

  for (let i = 0; i < SKU_COUNT; i++) {
    const brand = pick(rand, ALL_BRANDS);
    const type = pick(rand, PRODUCT_TYPES);
    const size = pick(rand, CLOTHING_SIZES);
    const color = pick(rand, CLOTHING_COLORS);
    const typeCode = type.split(" ").map((w) => w[0]).join("").toUpperCase();
    const sku = `${brand.substring(0, 3).toUpperCase()}-${typeCode}-${size}-${color.substring(0, 3).toUpperCase()}-${String(i + 1).padStart(4, "0")}`;
    const available = Math.floor(rand() * 200) + 5;
    const reserved = Math.floor(rand() * Math.min(available, 30));
    const damaged = Math.floor(rand() * 3);
    const asin = `B0${String(i).padStart(8, "0")}`;
    skus.push({
      id: `SKU-${i + 1}`,
      sku,
      asin,
      brand,
      productType: type,
      name: `${brand} ${type} — ${color}, ${size}`,
      category: "Clothing",
      size,
      color,
      image: `https://picsum.photos/seed/cloth-${i + 1}/80/80`,
      productUrl: `https://www.amazon.com/dp/${asin}`,
      available,
      reserved,
      damaged,
      location: `${pick(rand, WAREHOUSE_ZONES)}-${String(Math.floor(rand() * 20) + 1).padStart(2, "0")}`,
      lastUpdated: randomDateRecent(rand, 7),
      status: inventoryStatus(available),
      weight: (rand() * 0.55 + 0.12).toFixed(2),
      dimensions: `${Math.floor(rand() * 8 + 28)}x${Math.floor(rand() * 6 + 22)}x${Math.floor(rand() * 4 + 3)}`,
    });
  }

  const orders = [];
  const reviewOrders = [];

  for (let i = 0; i < TOTAL_ORDERS; i++) {
    const itemCount = pickWeighted(rand, [1, 2, 3], [60, 25, 15]);
    const items = [];
    for (let j = 0; j < itemCount; j++) {
      const skuItem = pick(rand, skus);
      items.push({
        sku: skuItem.sku,
        asin: skuItem.asin,
        brand: skuItem.brand,
        name: skuItem.name,
        productType: skuItem.productType,
        size: skuItem.size,
        color: skuItem.color,
        location: skuItem.location,
        image: skuItem.image,
        productUrl: skuItem.productUrl,
        qty: itemCount === 1 ? pickWeighted(rand, [1, 2, 3, 4], [48, 28, 16, 8]) : Math.floor(rand() * 2) + 1,
      });
    }
    const totalQty = items.reduce((s, it) => s + it.qty, 0);
    const orderType = items.length > 1 ? "multi" : "single";
    const qtyGroup = items.length > 1 ? "multi" : totalQty === 1 ? "1" : totalQty === 2 ? "2" : "3+";
    const status = pickWeighted(rand, ORDER_STATUSES, [22, 28, 28, 22]);
    const createdAt = randomDateRecent(rand);
    const statusUpdatedAt = statusTimestamp(createdAt, status.key, rand);
    const hasTracking = status.key === "dispatched" || (status.key === "packed" && rand() > 0.5);
    const trackingId = hasTracking ? generateDHLTracking(rand) : null;
    const needsReview = rand() < 0.04;
    const reviewReason = needsReview ? pick(rand, REVIEW_REASONS) : null;

    const order = {
      id: `ORD-${String(100000 + i)}`,
      amazonOrderId: `702-${String(Math.floor(rand() * 9000000) + 1000000)}-${String(Math.floor(rand() * 9000000) + 1000000)}`,
      items,
      orderType,
      qtyGroup,
      brand: items[0].brand,
      brandColor: BRAND_COLORS[items[0].brand] || "#64748b",
      status,
      statusUpdatedAt,
      statusTime: formatTime(statusUpdatedAt),
      createdAt,
      createdOn: formatDate(createdAt),
      createdTime: formatTime(createdAt),
      processingTime: processingTime(rand),
      assignedStaff: pick(rand, STAFF),
      trackingId,
      needsReview,
      reviewReason,
      customer: {
        name: `${pick(rand, ["John", "Jane", "Alex", "Maria", "Tom", "Emma"])} ${pick(rand, ["Smith", "Johnson", "Williams", "Brown"])}`,
        email: `customer${i}@email.com`,
        phone: `+44 7${String(Math.floor(rand() * 900000000) + 100000000)}`,
      },
      shippingAddress: {
        line1: `${Math.floor(rand() * 200) + 1} ${pick(rand, ["High Street", "Oak Avenue", "Church Road"])}`,
        line2: rand() > 0.75 ? `Apt ${Math.floor(rand() * 50) + 1}` : "",
        city: pick(rand, ["London", "Manchester", "Berlin", "Paris", "Amsterdam"]),
        postalCode: `${String.fromCharCode(65 + Math.floor(rand() * 26))}${Math.floor(rand() * 9) + 1} ${Math.floor(rand() * 9)}${String.fromCharCode(65 + Math.floor(rand() * 26))}${String.fromCharCode(65 + Math.floor(rand() * 26))}`,
        country: pick(rand, COUNTRIES),
        valid: !needsReview || reviewReason?.key !== "invalid_address",
      },
      timeline: TIMELINE_EVENTS.slice(0, Math.min(TIMELINE_EVENTS.length, ["unshipped", "ready", "packed", "dispatched"].indexOf(status.key) + 2)).map((event, idx) => ({
        event,
        time: new Date(createdAt.getTime() + idx * 3600000 * (rand() * 2 + 0.5)),
        completed: true,
      })),
      labelStatus: status.key === "dispatched" ? "Uploaded" : hasTracking ? "Generated" : needsReview && reviewReason?.key === "label_failed" ? "Failed" : "Pending",
      amazonSyncStatus: status.key === "dispatched" ? "Synced" : needsReview && reviewReason?.key === "amazon_failed" ? "Failed" : rand() > 0.85 ? "Pending" : "Synced",
      warehouse: pick(rand, WAREHOUSES),
      weight: (rand() * 1.2 + 0.2).toFixed(2),
      dimensions: `${Math.floor(rand() * 10 + 28)}x${Math.floor(rand() * 8 + 22)}x${Math.floor(rand() * 6 + 4)}`,
      staffConfirmed: status.key === "dispatched" || rand() > 0.3,
      syncBatch: createdAt.getHours() < 12 ? "06:00" : "13:00",
    };

    orders.push(order);
    if (needsReview) reviewOrders.push(order);
  }

  orders.sort((a, b) => b.createdAt - a.createdAt);

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayOrders = orders.filter((o) => o.createdAt >= todayStart);

  const brandOrderCounts = {};
  PRIMARY_BRANDS.forEach((b) => { brandOrderCounts[b] = 0; });
  todayOrders.forEach((o) => {
    if (PRIMARY_BRANDS.includes(o.brand)) brandOrderCounts[o.brand] = (brandOrderCounts[o.brand] || 0) + 1;
  });

  const inventoryByBrand = PRIMARY_BRANDS.map((brand) => ({
    brand,
    count: skus.filter((s) => s.brand === brand).reduce((sum, s) => sum + s.available, 0),
  }));

  const toProcessByBrand = PRIMARY_BRANDS.map((brand) => ({
    brand,
    count: todayOrders.filter((o) => o.brand === brand && (o.status.key === "unshipped" || o.status.key === "ready")).length,
  }));

  const inventorySummary = PRIMARY_BRANDS.map((brand) => {
    const brandSkus = skus.filter((s) => s.brand === brand);
    return {
      brand,
      skuCount: brandSkus.length,
      available: brandSkus.reduce((s, i) => s + i.available, 0),
      reserved: brandSkus.reduce((s, i) => s + i.reserved, 0),
      damaged: brandSkus.reduce((s, i) => s + i.damaged, 0),
      lowStock: brandSkus.filter((s) => s.status.key === "low" || s.status.key === "critical").length,
    };
  });

  const receivedReorders = Array.from({ length: 8 }, (_, i) => ({
    poNumber: `PO-2025-${String(100 + i)}`,
    brand: pick(rand, PRIMARY_BRANDS),
    items: Math.floor(rand() * 120 + 30),
    receivedDate: formatDate(randomDateRecent(rand, 7)),
    status: pick(rand, ["Received", "Partial", "Complete"]),
  }));

  const shippedProducts = orders
    .filter((o) => o.trackingId)
    .slice(0, 25)
    .map((o) => ({
      trackingId: o.trackingId,
      orderId: o.id,
      carrier: "DHL Express",
      brand: o.brand,
      dispatchDate: formatDate(o.statusUpdatedAt),
      status: pick(rand, SHIP_STATUSES),
    }));

  const salesActivity = todayOrders.slice(0, 15).flatMap((o, i) =>
    o.timeline.slice(-1).map((t) => ({
      id: `${o.id}-${i}`,
      event: t.event,
      time: t.time,
      orderId: o.id,
    }))
  ).sort((a, b) => b.time - a.time).slice(0, 12);

  const labelQueue = orders
    .filter((o) => o.status.key !== "dispatched" && !o.needsReview)
    .slice(0, 50)
    .map((o) => ({
      orderId: o.id,
      brand: o.brand,
      sku: o.items[0].sku,
      productName: o.items[0].name,
      weight: o.weight,
      dimensions: o.dimensions,
      country: o.shippingAddress.country,
      status: o.labelStatus,
      trackingId: o.trackingId,
      order: o,
    }));

  const needsReview = REVIEW_REASONS.map((reason) => ({
    ...reason,
    count: reviewOrders.filter((o) => o.reviewReason?.key === reason.key).length || Math.floor(rand() * 8 + 1),
    orders: reviewOrders.filter((o) => o.reviewReason?.key === reason.key).slice(0, 5),
  }));

  const batchCounts = {
    singleQty1: 300,
    singleQty2: 100,
    singleQty3: 10,
    multiSku: 90,
  };

  const singlelineOrders = batchCounts.singleQty1 + batchCounts.singleQty2 + batchCounts.singleQty3;
  const multilineOrders = batchCounts.multiSku;
  const unshippedToday = singlelineOrders + multilineOrders;

  const kpis = {
    totalSku: skus.length,
    multiOrders: multilineOrders,
    unshippedOrders: unshippedToday,
    singleOrders: singlelineOrders,
    todayTotal: unshippedToday,
    dailyTarget: DAILY_ORDER_VOLUME,
    trends: { totalSku: 3.2, multiOrders: 4.1, unshipped: -8, singleOrders: 6.5 },
  };

  const inventoryKpis = {
    total: skus.reduce((s, i) => s + i.available + i.reserved, 0),
    available: skus.reduce((s, i) => s + i.available, 0),
    reserved: skus.reduce((s, i) => s + i.reserved, 0),
    lowStock: skus.filter((s) => s.status.key === "low").length,
    outOfStock: skus.filter((s) => s.status.key === "out").length,
    damaged: skus.reduce((s, i) => s + i.damaged, 0),
  };

  const notifications = [
    { id: 1, title: `${unshippedToday} unshipped orders today — action needed`, time: "Just now", type: "warning" },
    { id: 2, title: `Amazon 13:00 sync imported ${Math.min(todayOrders.length, DAILY_ORDER_VOLUME)} orders`, time: "12 min ago", type: "success" },
    { id: 3, title: `${reviewOrders.length} orders in Needs Review queue`, time: "25 min ago", type: "error" },
    { id: 4, title: "DHL label batch: 42 labels generated", time: "1 hr ago", type: "info" },
    { id: 5, title: "Duplicate prevention blocked 3 re-imports", time: "2 hrs ago", type: "info" },
  ];

  return {
    orders,
    todayOrders,
    reviewOrders,
    skus,
    kpis,
    inventoryKpis,
    brandOrderCounts,
    inventoryByBrand,
    toProcessByBrand,
    inventorySummary,
    receivedReorders,
    shippedProducts,
    salesActivity,
    labelQueue,
    needsReview,
    batchCounts,
    notifications,
    warehouses: WAREHOUSES,
    staff: STAFF,
    brands: ALL_BRANDS,
    primaryBrands: PRIMARY_BRANDS,
    brandColors: BRAND_COLORS,
    dailyVolume: DAILY_ORDER_VOLUME,
  };
}

let cachedData = null;

export function getWarehouseData() {
  if (!cachedData) cachedData = generateWarehouseData();
  return cachedData;
}

export function resetWarehouseData() {
  cachedData = null;
}
