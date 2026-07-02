import { useState } from "react";
import { Typography, Button } from "@material-tailwind/react";
import {
  ClockIcon, ArrowPathIcon, ShieldCheckIcon, UserGroupIcon,
  DocumentDuplicateIcon, ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { PageCard, StatusBadge, Toggle } from "@/components/ui";
import { getWarehouseData } from "@/data/warehouse";

const WORKFLOW_STEPS = ["Generated", "Verified", "Approved", "Uploaded", "Completed"];

export function Automation() {
  const { batchCounts, needsReview } = getWarehouseData();
  const [confirmStep, setConfirmStep] = useState(2);
  const [syncEnabled, setSyncEnabled] = useState(true);

  const severityColor = { critical: "red", high: "orange", medium: "yellow", low: "gray" };

  return (
    <div className="space-y-6">
      <div>
        <Typography className="text-2xl font-bold text-slate-900">Automation Engine</Typography>
        <Typography className="text-sm text-slate-500">Amazon FBM sync, order processing, and fulfillment workflows</Typography>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <PageCard title="Amazon FBM Sync">
          <div className="mb-4 flex items-center justify-between rounded-xl bg-blue-50 p-4">
            <div className="flex items-center gap-3">
              <ClockIcon className="h-8 w-8 text-blue-600" />
              <div>
                <Typography className="font-semibold text-slate-900">Scheduled Sync</Typography>
                <Typography className="text-sm text-slate-500">Runs daily at 06:00 and 13:00</Typography>
              </div>
            </div>
            <Toggle checked={syncEnabled} onChange={() => setSyncEnabled(!syncEnabled)} />
          </div>
          <div className="space-y-2">
            {["Fetch Orders", "Sync Updates", "Store Raw Payload", "Prevent Duplicates", "Log Events"].map((task) => (
              <div key={task} className="flex items-center gap-3 rounded-lg border border-slate-100 px-4 py-2.5">
                <ArrowPathIcon className="h-4 w-4 text-emerald-500" />
                <Typography className="text-sm text-slate-700">{task}</Typography>
                <StatusBadge label="Active" color="green" />
              </div>
            ))}
          </div>
        </PageCard>

        <PageCard title="Order Item Processing">
          <div className="space-y-3">
            {[
              "Extract all line items",
              "Map SKU",
              "Map Brand",
              "Validate inventory",
              "Reserve stock",
            ].map((step, i) => (
              <div key={step} className="flex items-center gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600">{i + 1}</div>
                <Typography className="text-sm text-slate-700">{step}</Typography>
              </div>
            ))}
          </div>
        </PageCard>
      </div>

      <PageCard title="Batch Split Logic" subtitle="Automatic order classification">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Single SKU Qty 1", count: batchCounts.singleQty1, color: "bg-blue-50 border-blue-200" },
            { label: "Single SKU Qty 2", count: batchCounts.singleQty2, color: "bg-indigo-50 border-indigo-200" },
            { label: "Single SKU Qty 3+", count: batchCounts.singleQty3, color: "bg-violet-50 border-violet-200" },
            { label: "Multiline Orders", count: batchCounts.multiSku, color: "bg-purple-50 border-purple-200" },
          ].map(({ label, count, color }) => (
            <div key={label} className={`rounded-xl border p-5 ${color}`}>
              <Typography className="text-sm font-medium text-slate-600">{label}</Typography>
              <Typography className="mt-2 text-3xl font-bold text-slate-900">{count.toLocaleString()}</Typography>
            </div>
          ))}
        </div>
      </PageCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <PageCard title="Brand Segregation Engine">
          <div className="grid grid-cols-2 gap-3">
            {["Brand", "SKU", "Warehouse Zone", "Priority"].map((group) => (
              <div key={group} className="rounded-xl bg-slate-50 p-4 text-center">
                <Typography className="text-sm font-semibold text-slate-700">Group by {group}</Typography>
                <StatusBadge label="Enabled" color="green" />
              </div>
            ))}
          </div>
        </PageCard>

        <PageCard title="Duplicate Prevention Engine">
          <div className="space-y-3">
            <Typography className="text-sm text-slate-600">Prevents duplicate imports from 06:00 and 13:00 sync runs</Typography>
            {[
              { label: "Amazon Order ID uniqueness", icon: DocumentDuplicateIcon },
              { label: "Tracking uniqueness", icon: ShieldCheckIcon },
              { label: "Label uniqueness", icon: ShieldCheckIcon },
              { label: "Audit logging", icon: ArrowPathIcon },
            ].map(({ label, icon: Icon }) => (
              <div key={label} className="flex items-center gap-3 rounded-lg border border-slate-100 px-4 py-2">
                <Icon className="h-4 w-4 text-emerald-500" />
                <Typography className="text-sm text-slate-700">{label}</Typography>
              </div>
            ))}
          </div>
        </PageCard>
      </div>

      <PageCard title="Needs Review" subtitle="Orders requiring manual intervention">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {needsReview.map((item) => (
            <div key={item.key} className="flex items-center justify-between rounded-xl border border-slate-100 p-4 transition-shadow hover:shadow-md">
              <div className="flex items-center gap-2">
                <ExclamationTriangleIcon className={`h-5 w-5 ${item.severity === "critical" ? "text-red-500" : item.severity === "high" ? "text-orange-500" : "text-amber-500"}`} />
                <Typography className="text-sm text-slate-700">{item.label}</Typography>
              </div>
              <StatusBadge label={String(item.count)} color={severityColor[item.severity]} />
            </div>
          ))}
        </div>
      </PageCard>

      <PageCard title="Staff Confirmation Workflow" subtitle="Required before Amazon tracking upload">
        <div className="mb-6 flex flex-wrap items-center gap-2">
          {WORKFLOW_STEPS.map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <button
                onClick={() => setConfirmStep(i)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  i <= confirmStep ? "bg-emerald-600 text-white shadow-md" : "bg-slate-100 text-slate-500"
                }`}
              >
                {step}
              </button>
              {i < WORKFLOW_STEPS.length - 1 && <div className="h-0.5 w-6 bg-slate-200" />}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4 rounded-xl bg-amber-50 p-4">
          <UserGroupIcon className="h-8 w-8 text-amber-600" />
          <div className="flex-1">
            <Typography className="font-semibold text-slate-900">Awaiting staff confirmation</Typography>
            <Typography className="text-sm text-slate-500">Current step: {WORKFLOW_STEPS[confirmStep]}</Typography>
          </div>
          <Button color="green" className="normal-case" onClick={() => setConfirmStep(Math.min(confirmStep + 1, 4))}>
            Confirm {WORKFLOW_STEPS[confirmStep + 1] || "Complete"}
          </Button>
        </div>
      </PageCard>
    </div>
  );
}

export default Automation;
