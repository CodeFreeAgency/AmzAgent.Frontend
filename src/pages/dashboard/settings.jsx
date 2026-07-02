import { useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Typography, Input, Button } from "@material-tailwind/react";
import {
  ClockIcon,
  CheckCircleIcon,
  CubeIcon,
  TruckIcon,
  SignalIcon,
} from "@heroicons/react/24/outline";
import { PageCard, StatusBadge, Toggle } from "@/components/ui";
import { getWarehouseData } from "@/data/warehouse";
import { DHL_SERVICES, DEFAULT_DIMENSION_RULES } from "@/data/dhl-shipping";
import { useAuth } from "@/context/auth";
import { useToast } from "@/context/toast";
import { useWriteGuard } from "@/hooks/useWriteGuard";
import { PERMISSIONS } from "@/lib/permissions";
import { WarehouseStaffManager } from "@/components/settings/WarehouseStaffManager";

const selectClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500";

const ALL_TABS = ["Automation", "DHL", "Users"];

const tabClass = (active) =>
  active
    ? "bg-white text-slate-900 shadow-sm"
    : "text-slate-600 hover:text-slate-900";

function SettingRow({ icon: Icon, title, description, children }) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100">
          <Icon className="h-5 w-5 text-slate-600" />
        </div>
        <div className="min-w-0">
          <Typography className="text-sm text-slate-900">{title}</Typography>
          <Typography className="text-xs text-slate-500">{description}</Typography>
        </div>
      </div>
      <div className="shrink-0 sm:pl-4">{children}</div>
    </div>
  );
}

SettingRow.propTypes = {
  icon: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  children: PropTypes.node,
};

export function Settings() {
  const { dailyVolume } = getWarehouseData();
  const { hasPermission } = useAuth();
  const { showToast } = useToast();
  const { guardAction, canWrite } = useWriteGuard();

  const visibleTabs = useMemo(
    () =>
      ALL_TABS.filter(
        (tab) => tab !== "Users" || hasPermission(PERMISSIONS.WAREHOUSE_STAFF_VIEW)
      ),
    [hasPermission]
  );

  const [activeTab, setActiveTab] = useState("Automation");
  const [sync06, setSync06] = useState(true);
  const [sync13, setSync13] = useState(true);
  const [dimensionRules, setDimensionRules] = useState(DEFAULT_DIMENSION_RULES);
  const [dhlSaved, setDhlSaved] = useState(false);

  const updateDimension = (id, field, value) => {
    guardAction(() => {
      setDimensionRules((rows) => rows.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
      setDhlSaved(false);
    });
  };

  const safeTab = visibleTabs.includes(activeTab) ? activeTab : visibleTabs[0];

  return (
    <div className="space-y-5">
      <div>
        <Typography className="text-2xl font-semibold text-slate-900">Settings</Typography>
        <Typography className="text-sm text-slate-500">
          Automation rules for ~{dailyVolume} daily FBM orders
          {!canWrite && " · Read-only access"}
        </Typography>
      </div>

      <div className="inline-flex gap-1 rounded-lg border border-slate-200 bg-slate-100 p-1">
        {visibleTabs.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setActiveTab(t)}
            className={`rounded-md px-4 py-2 text-sm transition-all ${tabClass(safeTab === t)}`}
          >
            {t}
          </button>
        ))}
      </div>

      {safeTab === "Automation" && (
        <div className="space-y-4">
          <PageCard
            title="Amazon FBM Order Sync"
            subtitle="Scheduled pulls for unshipped FBM orders"
            icon={ClockIcon}
          >
            <div className="space-y-3">
              {[
                { time: "06:00", enabled: sync06, set: setSync06, label: "Morning sync" },
                { time: "13:00", enabled: sync13, set: setSync13, label: "Afternoon sync" },
              ].map(({ time, enabled, set, label }) => (
                <SettingRow
                  key={time}
                  icon={ClockIcon}
                  title={`${label} — ${time}`}
                  description="Fetch unshipped FBM orders, store payload, prevent duplicates"
                >
                  <Toggle
                    checked={enabled}
                    disabled={!canWrite}
                    onChange={() => guardAction(() => set(!enabled))}
                  />
                </SettingRow>
              ))}
            </div>
          </PageCard>
        </div>
      )}

      {safeTab === "DHL" && (
        <div className="space-y-4">
          <PageCard
            title="DHL Integration"
            subtitle="API credentials and connection status"
            icon={TruckIcon}
          >
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-4">
                <Input label="Account Number" defaultValue="123456789" crossOrigin="" />
                <Input label="API Key" type="password" defaultValue="••••••••••••" crossOrigin="" />
              </div>
              <div className="flex flex-col justify-between gap-4 rounded-lg border border-slate-100 bg-slate-50/60 p-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <SignalIcon className="h-5 w-5 text-emerald-600" />
                    <Typography className="text-sm text-slate-900">Connection</Typography>
                  </div>
                  <StatusBadge label="Connected" color="green" />
                  <Typography className="text-xs text-slate-500">
                    Last verified today · API endpoint responding normally
                  </Typography>
                </div>
                <Button
                  color="blue"
                  variant="outlined"
                  className="font-normal normal-case"
                  onClick={() => guardAction(() => showToast("DHL connection test passed.", "success"))}
                >
                  Test Connection
                </Button>
              </div>
            </div>
          </PageCard>

          <PageCard
            title="Parcel Size & Weight"
            subtitle="Packaging tiers matched from order weight and dimensions"
            icon={CubeIcon}
          >
            <Typography className="mb-4 text-xs text-slate-500">
              Orders are matched to the smallest tier that fits. Dimensions in centimetres; weight in kilograms.
            </Typography>
            <div className="grid gap-3 sm:grid-cols-2">
              {dimensionRules.map((row) => (
                <div
                  key={row.id}
                  className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <Typography className="text-sm text-slate-900">{row.tier}</Typography>
                    <Toggle
                      checked={row.enabled}
                      disabled={!canWrite}
                      onChange={() => updateDimension(row.id, "enabled", !row.enabled)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { field: "maxWeightKg", label: "Max kg" },
                      { field: "maxLengthCm", label: "Max L" },
                      { field: "maxWidthCm", label: "Max W" },
                      { field: "maxHeightCm", label: "Max H" },
                    ].map(({ field, label }) => (
                      <div key={field}>
                        <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                          {label}
                        </label>
                        <input
                          type="number"
                          value={row[field]}
                          onChange={(e) => updateDimension(row.id, field, e.target.value)}
                          className={selectClass}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 space-y-2">
                    <div>
                      <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                        Packaging
                      </label>
                      <input
                        value={row.packaging}
                        onChange={(e) => updateDimension(row.id, "packaging", e.target.value)}
                        className={selectClass}
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                        DHL Service
                      </label>
                      <select
                        className={selectClass}
                        value={row.service}
                        onChange={(e) => updateDimension(row.id, "service", e.target.value)}
                      >
                        {DHL_SERVICES.map((s) => (
                          <option key={s.value} value={s.value}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </PageCard>

          <div className="flex items-center gap-3">
            <Button
              color="blue"
              className="font-normal normal-case"
              onClick={() => guardAction(() => setDhlSaved(true))}
            >
              Save DHL Settings
            </Button>
            {dhlSaved && canWrite && (
              <span className="flex items-center gap-1 text-sm text-emerald-600">
                <CheckCircleIcon className="h-4 w-4" />
                Settings saved
              </span>
            )}
          </div>
        </div>
      )}

      {safeTab === "Users" && hasPermission(PERMISSIONS.WAREHOUSE_STAFF_VIEW) && (
        <WarehouseStaffManager />
      )}
    </div>
  );
}

export default Settings;
