import PropTypes from "prop-types";

import { Button, Typography } from "@material-tailwind/react";

import { Drawer, StatusBadge, Timeline } from "@/components/ui";

import { OrderItemCell } from "@/components/orders/OrderItemCell";



export function OrderDrawer({

  order,

  open,

  onClose,

  onGenerateLabel,

  onMarkPacked,

  onUploadToAmazon,

  onResolveReview,

}) {

  if (!order) return null;



  const canUpload = order.trackingId && order.staffConfirmed && order.amazonSyncStatus !== "Synced";



  return (

    <Drawer open={open} onClose={onClose} title={order.id} subtitle={`Amazon ${order.amazonOrderId} · Sync batch ${order.syncBatch}`} width="max-w-2xl">

      <div className="space-y-6">

        <div className="flex flex-wrap gap-2">

          <StatusBadge label={order.status.label} color={order.status.color} />

          <Typography className="self-center text-xs text-slate-400">Updated {order.statusTime}</Typography>

          <StatusBadge label={`Label: ${order.labelStatus}`} color={order.labelStatus === "Uploaded" ? "green" : order.labelStatus === "Failed" ? "red" : "yellow"} />

          <StatusBadge label={`Amazon: ${order.amazonSyncStatus}`} color={order.amazonSyncStatus === "Synced" ? "green" : order.amazonSyncStatus === "Failed" ? "red" : "orange"} />

          {order.needsReview && <StatusBadge label={`Review: ${order.reviewReason?.label}`} color="red" />}

        </div>



        <section>

          <Typography className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Customer</Typography>

          <Typography className="font-medium text-slate-900">{order.customer.name}</Typography>

          <Typography className="text-sm text-slate-500">{order.customer.email} · {order.customer.phone}</Typography>

        </section>



        <section>

          <Typography className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Shipping Address</Typography>

          <Typography className={`text-sm ${order.shippingAddress.valid === false ? "text-red-600" : "text-slate-700"}`}>

            {order.shippingAddress.line1}<br />

            {order.shippingAddress.line2 && <>{order.shippingAddress.line2}<br /></>}

            {order.shippingAddress.city}, {order.shippingAddress.postalCode}<br />

            {order.shippingAddress.country}

            {order.shippingAddress.valid === false && <span className="mt-1 block text-red-500">⚠ Invalid address</span>}

          </Typography>

        </section>



        <section>

          <Typography className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Order Items</Typography>

          <div className="space-y-3">

            {order.items.map((item, i) => (

              <div key={i} className="flex items-center gap-3 rounded-lg border border-slate-100 p-3">

                <div className="min-w-0 flex-1">

                  <OrderItemCell item={item} />

                </div>

                <Typography className="shrink-0 text-sm font-bold text-slate-800">×{item.qty}</Typography>

              </div>

            ))}

          </div>

        </section>



        <section>

          <Typography className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Timeline</Typography>

          <Timeline events={order.timeline.map((t, i) => ({ ...t, id: i }))} />

        </section>



        <div className="grid grid-cols-2 gap-4 rounded-lg bg-slate-50 p-4 text-sm">

          <div>

            <Typography className="text-xs text-slate-400">Tracking ID</Typography>

            <Typography className="font-mono text-blue-600">{order.trackingId || "Not generated"}</Typography>

          </div>

          <div>

            <Typography className="text-xs text-slate-400">Batch Type</Typography>

            <Typography className="text-slate-700">{order.qtyGroup === "multi" ? "Multi Line Order" : `Single Line · Qty ${order.qtyGroup}`}</Typography>

          </div>

          <div>

            <Typography className="text-xs text-slate-400">Assigned Staff</Typography>

            <Typography className="text-slate-700">{order.assignedStaff}</Typography>

          </div>

          <div>

            <Typography className="text-xs text-slate-400">Staff Confirmed</Typography>

            <Typography className={order.staffConfirmed ? "text-emerald-600" : "text-amber-600"}>

              {order.staffConfirmed ? "Yes" : "Pending confirmation"}

            </Typography>

          </div>

          <div>

            <Typography className="text-xs text-slate-400">Weight / Dimensions</Typography>

            <Typography className="text-slate-700">{order.weight} kg · {order.dimensions} cm</Typography>

          </div>

          <div>

            <Typography className="text-xs text-slate-400">Processing Time</Typography>

            <Typography className="text-slate-700">{order.processingTime}</Typography>

          </div>

        </div>



        <div className="sticky bottom-0 flex flex-wrap gap-2 border-t border-slate-100 bg-white pt-4">

          <Button

            size="sm"

            color="blue"

            className="normal-case"

            onClick={() => onGenerateLabel?.(order.id)}

            disabled={order.labelStatus === "Generated" || order.labelStatus === "Uploaded" || order.needsReview}

          >

            Generate DHL Label

          </Button>

          <Button

            size="sm"

            variant="outlined"

            className="normal-case"

            onClick={() => onMarkPacked?.(order.id)}

            disabled={order.status.key === "packed" || order.status.key === "dispatched"}

          >

            Mark Packed

          </Button>

          <Button

            size="sm"

            variant="outlined"

            className="normal-case"

            onClick={() => onUploadToAmazon?.(order.id)}

            disabled={!canUpload}

          >

            Upload to Amazon

          </Button>

          {order.needsReview && (

            <Button

              size="sm"

              variant="text"

              color="amber"

              className="normal-case"

              onClick={() => onResolveReview?.(order.id)}

            >

              Resolve Review

            </Button>

          )}

        </div>

      </div>

    </Drawer>

  );

}



OrderDrawer.propTypes = {

  order: PropTypes.object,

  open: PropTypes.bool.isRequired,

  onClose: PropTypes.func.isRequired,

  onGenerateLabel: PropTypes.func,

  onMarkPacked: PropTypes.func,

  onUploadToAmazon: PropTypes.func,

  onResolveReview: PropTypes.func,

};



export default OrderDrawer;

