import { useState, useMemo, useCallback } from "react";
import { getWarehouseData } from "@/data/warehouse";
import { REVIEW_REASONS } from "@/data/warehouse/constants";
import { useToast } from "@/context/toast";
import {
  generateDHLLabel,
  markOrderPacked,
  uploadTrackingToAmazon,
  confirmStaffVerification,
  resolveOrderReview,
  applyOrderAction,
  applyBulkOrderAction,
  buildLabelQueue,
  buildNeedsReviewGroups,
  downloadLabelFile,
} from "@/components/orders/orderActions";

function summarizeBulk(success, failed, actionLabel) {
  if (success.length === 0 && failed.length > 0) {
    return { variant: "error", message: `Bulk ${actionLabel} failed. ${failed[0].message}` };
  }
  if (failed.length > 0) {
    return {
      variant: "warning",
      message: `Bulk ${actionLabel}: ${success.length} succeeded, ${failed.length} skipped.`,
    };
  }
  return {
    variant: "success",
    message: `Bulk ${actionLabel} completed for ${success.length} order${success.length === 1 ? "" : "s"}.`,
  };
}

export function useOrdersWorkspace() {
  const initial = useMemo(() => getWarehouseData(), []);
  const [orders, setOrders] = useState(initial.orders);
  const { showToast } = useToast();

  const labelQueue = useMemo(() => buildLabelQueue(orders), [orders]);
  const reviewOrders = useMemo(() => orders.filter((o) => o.needsReview), [orders]);
  const needsReview = useMemo(
    () => buildNeedsReviewGroups(reviewOrders, REVIEW_REASONS),
    [reviewOrders]
  );

  const runSingle = useCallback(
    (orderId, actionFn, successVariant = "success") => {
      let outcome = { ok: false, message: "Order not found" };
      setOrders((prev) => {
        const { orders: next, result } = applyOrderAction(prev, orderId, actionFn);
        outcome = result;
        return next;
      });
      showToast(outcome.message, outcome.ok ? successVariant : "error");
      return outcome;
    },
    [showToast]
  );

  const runBulk = useCallback(
    (orderIds, actionFn, actionLabel) => {
      if (!orderIds.length) {
        showToast("Select at least one order.", "warning");
        return { success: [], failed: [] };
      }
      let summary = { success: [], failed: [] };
      setOrders((prev) => {
        const applied = applyBulkOrderAction(prev, orderIds, actionFn);
        summary = { success: applied.success, failed: applied.failed };
        return applied.orders;
      });
      const { variant, message } = summarizeBulk(summary.success, summary.failed, actionLabel);
      showToast(message, variant);
      return summary;
    },
    [showToast]
  );

  const generateLabel = useCallback(
    (orderId) => runSingle(orderId, generateDHLLabel),
    [runSingle]
  );

  const markPacked = useCallback(
    (orderId) => runSingle(orderId, markOrderPacked),
    [runSingle]
  );

  const uploadToAmazon = useCallback(
    (orderId) => runSingle(orderId, uploadTrackingToAmazon),
    [runSingle]
  );

  const confirmStaff = useCallback(
    (orderId) => runSingle(orderId, confirmStaffVerification),
    [runSingle]
  );

  const resolveReview = useCallback(
    (orderId) => runSingle(orderId, resolveOrderReview),
    [runSingle]
  );

  const bulkGenerateLabels = useCallback(
    (orderIds) => runBulk(orderIds, generateDHLLabel, "label generation"),
    [runBulk]
  );

  const bulkMarkPacked = useCallback(
    (orderIds) => runBulk(orderIds, markOrderPacked, "mark packed"),
    [runBulk]
  );

  const bulkUploadToAmazon = useCallback(
    (orderIds) => runBulk(orderIds, uploadTrackingToAmazon, "Amazon upload"),
    [runBulk]
  );

  const handleDownloadLabel = useCallback(
    (order) => {
      if (!order?.trackingId) {
        showToast("Generate a DHL label before downloading.", "warning");
        return;
      }
      downloadLabelFile(order);
      showToast(`Label downloaded for ${order.id}.`, "success");
    },
    [showToast]
  );

  const handlePrintLabel = useCallback(
    (order) => {
      if (!order?.trackingId) {
        showToast("Generate a DHL label before printing.", "warning");
        return;
      }
      showToast(`Sent ${order.id} label to printer queue.`, "info");
    },
    [showToast]
  );

  return {
    orders,
    labelQueue,
    needsReview,
    reviewOrders,
    primaryBrands: initial.primaryBrands,
    batchCounts: initial.batchCounts,
    generateLabel,
    markPacked,
    uploadToAmazon,
    confirmStaff,
    resolveReview,
    bulkGenerateLabels,
    bulkMarkPacked,
    bulkUploadToAmazon,
    downloadLabel: handleDownloadLabel,
    printLabel: handlePrintLabel,
  };
}
