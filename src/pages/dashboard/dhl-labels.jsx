import { useState } from "react";
import { Typography, Button, Stepper, Step, IconButton } from "@material-tailwind/react";
import {
  CheckCircleIcon, ArrowDownTrayIcon, PrinterIcon, ArrowPathIcon,
  CloudArrowUpIcon, TruckIcon,
} from "@heroicons/react/24/outline";
import { PageCard, StatusBadge } from "@/components/ui";
import { getWarehouseData } from "@/data/warehouse";

const STEPS = [
  "Validate Address",
  "Validate SKU Mapping",
  "Generate DHL Label",
  "Receive Tracking ID",
  "Staff Verification",
  "Upload Tracking To Amazon",
];

export function DhlLabels() {
  const { labelQueue } = getWarehouseData();
  const [selectedLabel, setSelectedLabel] = useState(labelQueue[0] || null);
  const [workflowStep, setWorkflowStep] = useState(4);

  return (
    <div className="space-y-6">
      <div>
        <Typography className="text-2xl font-bold text-slate-900">DHL Label Generation</Typography>
        <Typography className="text-sm text-slate-500">Shipping operations module — {labelQueue.length} labels in queue</Typography>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <PageCard title="Label Queue" className="xl:col-span-2">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-slate-100">
                  {["Order ID", "Brand", "SKU", "Weight", "Dimensions", "Country", "Status", "Actions"].map((h) => (
                    <th key={h} className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {labelQueue.slice(0, 20).map((row) => (
                  <tr
                    key={row.orderId}
                    className={`cursor-pointer border-b border-slate-50 transition-colors hover:bg-blue-50/40 ${selectedLabel?.orderId === row.orderId ? "bg-blue-50" : ""}`}
                    onClick={() => setSelectedLabel(row)}
                  >
                    <td className="px-3 py-2.5 text-sm font-semibold text-blue-600">{row.orderId}</td>
                    <td className="px-3 py-2.5 text-sm text-slate-700">{row.brand}</td>
                    <td className="px-3 py-2.5 text-xs font-mono text-slate-600">{row.sku}</td>
                    <td className="px-3 py-2.5 text-sm text-slate-600">{row.weight} kg</td>
                    <td className="px-3 py-2.5 text-xs text-slate-500">{row.dimensions}</td>
                    <td className="px-3 py-2.5 text-sm text-slate-600">{row.country}</td>
                    <td className="px-3 py-2.5">
                      <StatusBadge label={row.status} color={row.status === "Uploaded" ? "green" : row.status === "Generated" ? "blue" : "yellow"} />
                    </td>
                    <td className="px-3 py-2.5">
                      <Button size="sm" variant="text" color="blue" className="normal-case text-xs">Generate</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </PageCard>

        <PageCard title="Generation Flow">
          <Stepper activeStep={workflowStep} className="overflow-x-auto">
            {STEPS.map((label, i) => (
              <Step key={label} onClick={() => setWorkflowStep(i)} className="cursor-pointer">
                <div className="text-left">
                  <Typography className="text-xs font-semibold text-slate-700">{i + 1}. {label}</Typography>
                </div>
              </Step>
            ))}
          </Stepper>
          <div className="mt-4 flex flex-wrap gap-2">
            {STEPS.map((s, i) => (
              <div key={s} className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${i <= workflowStep ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-400"}`}>
                {i <= workflowStep && <CheckCircleIcon className="h-3.5 w-3.5" />}
                {s}
              </div>
            ))}
          </div>
        </PageCard>
      </div>

      {selectedLabel && (
        <PageCard title="Label Details" subtitle={selectedLabel.orderId}>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Typography className="text-xs font-semibold uppercase text-slate-400">Tracking Number</Typography>
                  <Typography className="font-mono text-sm text-blue-600">{selectedLabel.order?.trackingId || "Pending"}</Typography>
                </div>
                <div>
                  <Typography className="text-xs font-semibold uppercase text-slate-400">Carrier</Typography>
                  <Typography className="text-sm text-slate-700">DHL Express</Typography>
                </div>
                <div>
                  <Typography className="text-xs font-semibold uppercase text-slate-400">Service</Typography>
                  <Typography className="text-sm text-slate-700">DHL Paket International</Typography>
                </div>
                <div>
                  <Typography className="text-xs font-semibold uppercase text-slate-400">Generation Time</Typography>
                  <Typography className="text-sm text-slate-700">{new Date().toLocaleString()}</Typography>
                </div>
              </div>

              <div>
                <Typography className="mb-2 text-xs font-semibold uppercase text-slate-400">Shipping Address</Typography>
                <Typography className="text-sm text-slate-600">
                  {selectedLabel.order?.shippingAddress.line1}<br />
                  {selectedLabel.order?.shippingAddress.city}, {selectedLabel.order?.shippingAddress.postalCode}<br />
                  {selectedLabel.order?.shippingAddress.country}
                </Typography>
              </div>

              <div>
                <Typography className="mb-2 text-xs font-semibold uppercase text-slate-400">Warehouse Address</Typography>
                <Typography className="text-sm text-slate-600">
                  Fulfilment Agent<br />
                  Unit 4, Logistics Park<br />
                  London, E16 2QD, UK
                </Typography>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Typography className="text-xs font-semibold uppercase text-slate-400">Dimensions</Typography>
                  <Typography className="text-sm text-slate-700">{selectedLabel.dimensions} cm</Typography>
                </div>
                <div>
                  <Typography className="text-xs font-semibold uppercase text-slate-400">Weight</Typography>
                  <Typography className="text-sm text-slate-700">{selectedLabel.weight} kg</Typography>
                </div>
              </div>
            </div>

            <div>
              <div className="flex h-64 flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50">
                <div className="mb-4 rounded-lg bg-white p-4 shadow-sm">
                  <div className="flex h-8 items-end justify-center gap-0.5">
                    {Array.from({ length: 30 }).map((_, i) => (
                      <div key={i} className="w-1 bg-slate-800" style={{ height: `${12 + Math.sin(i) * 8}px` }} />
                    ))}
                  </div>
                  <Typography className="mt-2 text-center font-mono text-xs text-slate-500">
                    {selectedLabel.order?.trackingId || "DHL-LABEL-PREVIEW"}
                  </Typography>
                </div>
                <Typography className="text-sm text-slate-400">PDF Label Preview</Typography>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <Button size="sm" className="flex items-center gap-2 normal-case">
                  <ArrowDownTrayIcon className="h-4 w-4" /> Download
                </Button>
                <Button size="sm" variant="outlined" className="flex items-center gap-2 normal-case">
                  <PrinterIcon className="h-4 w-4" /> Print
                </Button>
                <Button size="sm" variant="outlined" className="flex items-center gap-2 normal-case">
                  <ArrowPathIcon className="h-4 w-4" /> Regenerate
                </Button>
                <Button size="sm" variant="outlined" color="blue" className="flex items-center gap-2 normal-case">
                  <CloudArrowUpIcon className="h-4 w-4" /> Upload Tracking
                </Button>
                <Button size="sm" color="green" className="flex items-center gap-2 normal-case">
                  <TruckIcon className="h-4 w-4" /> Mark Shipped
                </Button>
              </div>
            </div>
          </div>
        </PageCard>
      )}
    </div>
  );
}

export default DhlLabels;
