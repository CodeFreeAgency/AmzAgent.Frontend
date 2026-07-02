import { ORDER_STATUSES } from "@/data/warehouse/constants";

const STATUS_BY_KEY = Object.fromEntries(ORDER_STATUSES.map((s) => [s.key, s]));

function formatTime(d = new Date()) {
  return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

function generateTrackingId() {
  return `${Math.floor(Math.random() * 9) + 1}${String(Math.floor(Math.random() * 1e9)).padStart(9, "0")}${Math.floor(Math.random() * 9) + 1}`;
}

function appendTimeline(order, event) {
  const exists = order.timeline.some((t) => t.event === event);
  if (exists) return order.timeline;
  return [...order.timeline, { event, time: new Date(), completed: true }];
}

export function generateDHLLabel(order) {
  if (order.needsReview) {
    return { ok: false, message: `${order.id} is in the review queue` };
  }
  if (order.shippingAddress?.valid === false) {
    return { ok: false, message: `${order.id} has an invalid shipping address` };
  }
  if (order.labelStatus === "Generated" || order.labelStatus === "Uploaded") {
    return { ok: false, message: `${order.id} already has a label` };
  }

  const now = new Date();
  return {
    ok: true,
    order: {
      ...order,
      trackingId: generateTrackingId(),
      labelStatus: "Generated",
      staffConfirmed: true,
      timeline: appendTimeline(order, "Label generated"),
      statusTime: formatTime(now),
    },
    message: `DHL label generated for ${order.id}`,
  };
}

export function markOrderPacked(order) {
  if (order.status.key === "dispatched") {
    return { ok: false, message: `${order.id} is already dispatched` };
  }
  if (order.status.key === "packed") {
    return { ok: false, message: `${order.id} is already packed` };
  }

  const now = new Date();
  return {
    ok: true,
    order: {
      ...order,
      status: STATUS_BY_KEY.packed,
      statusUpdatedAt: now,
      statusTime: formatTime(now),
      timeline: appendTimeline(order, "Order packed"),
    },
    message: `${order.id} marked as packed`,
  };
}

export function uploadTrackingToAmazon(order) {
  if (!order.trackingId) {
    return { ok: false, message: `${order.id}: generate a DHL label first` };
  }
  if (!order.staffConfirmed) {
    return { ok: false, message: `${order.id}: staff confirmation required` };
  }
  if (order.amazonSyncStatus === "Synced" && order.labelStatus === "Uploaded") {
    return { ok: false, message: `${order.id} is already synced to Amazon` };
  }

  const now = new Date();
  return {
    ok: true,
    order: {
      ...order,
      amazonSyncStatus: "Synced",
      labelStatus: "Uploaded",
      status: STATUS_BY_KEY.dispatched,
      statusUpdatedAt: now,
      statusTime: formatTime(now),
      timeline: appendTimeline(order, "Dispatched"),
    },
    message: `Tracking uploaded to Amazon for ${order.id}`,
  };
}

export function confirmStaffVerification(order) {
  if (order.staffConfirmed) {
    return { ok: false, message: `${order.id} is already confirmed` };
  }
  return {
    ok: true,
    order: { ...order, staffConfirmed: true },
    message: `Staff verification confirmed for ${order.id}`,
  };
}

export function resolveOrderReview(order) {
  if (!order.needsReview) {
    return { ok: false, message: `${order.id} is not in review` };
  }
  return {
    ok: true,
    order: {
      ...order,
      needsReview: false,
      reviewReason: null,
      shippingAddress: order.shippingAddress?.valid === false
        ? { ...order.shippingAddress, valid: true }
        : order.shippingAddress,
    },
    message: `Review resolved for ${order.id}`,
  };
}

export function applyOrderAction(orders, orderId, actionFn) {
  let result = { ok: false, message: "Order not found" };
  const next = orders.map((order) => {
    if (order.id !== orderId) return order;
    result = actionFn(order);
    return result.ok ? result.order : order;
  });
  return { orders: next, result };
}

export function applyBulkOrderAction(orders, orderIds, actionFn) {
  const idSet = new Set(orderIds);
  const success = [];
  const failed = [];

  const next = orders.map((order) => {
    if (!idSet.has(order.id)) return order;
    const result = actionFn(order);
    if (result.ok) {
      success.push(order.id);
      return result.order;
    }
    failed.push({ id: order.id, message: result.message });
    return order;
  });

  return { orders: next, success, failed };
}

export function buildLabelQueue(orders) {
  return orders
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
}

export function buildNeedsReviewGroups(reviewOrders, reviewReasons) {
  return reviewReasons.map((reason) => ({
    ...reason,
    count: reviewOrders.filter((o) => o.reviewReason?.key === reason.key).length,
    orders: reviewOrders.filter((o) => o.reviewReason?.key === reason.key).slice(0, 5),
  }));
}

export function downloadLabelFile(order) {
  if (!order.trackingId) return false;
  const content = [
    "DHL EXPRESS SHIPPING LABEL",
    `Order: ${order.id}`,
    `Amazon: ${order.amazonOrderId}`,
    `Tracking: ${order.trackingId}`,
    `Weight: ${order.weight} kg`,
    `Destination: ${order.shippingAddress.city}, ${order.shippingAddress.country}`,
  ].join("\n");
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `DHL-${order.id}.txt`;
  link.click();
  URL.revokeObjectURL(url);
  return true;
}
