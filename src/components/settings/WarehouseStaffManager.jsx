import { useRef, useState } from "react";
import {
  Typography,
  Button,
  Input,
  IconButton,
} from "@material-tailwind/react";
import {
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  CameraIcon,
} from "@heroicons/react/24/outline";
import { PageCard, StatusBadge, Drawer } from "@/components/ui";
import { StaffAvatar, StaffAvatarPreview } from "@/components/settings/StaffAvatar";
import { useToast } from "@/context/toast";
import { useWriteGuard } from "@/hooks/useWriteGuard";
import { getBundledStaffAvatarOptions } from "@/lib/staffAvatars";
import {
  getWarehouseStaff,
  createWarehouseStaffMember,
  updateWarehouseStaffMember,
  deleteWarehouseStaffMember,
  STAFF_ROLES,
  STAFF_STATUSES,
} from "@/lib/warehouseStaff";

const selectClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500";

const EMPTY_FORM = {
  name: "",
  email: "",
  role: "Picker",
  status: "active",
  avatar: null,
};

function statusMeta(key) {
  return STAFF_STATUSES.find((s) => s.key === key) || STAFF_STATUSES[0];
}

export function WarehouseStaffManager() {
  const { showToast } = useToast();
  const { guardAction } = useWriteGuard();
  const fileRef = useRef(null);

  const [staff, setStaff] = useState(() => getWarehouseStaff());
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");

  const bundledAvatars = getBundledStaffAvatarOptions();
  const isEditing = Boolean(editingId);

  const refresh = () => setStaff(getWarehouseStaff());

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setDrawerOpen(true);
  };

  const openEdit = (member) => {
    setEditingId(member.id);
    setForm({
      name: member.name,
      email: member.email || "",
      role: member.role,
      status: member.status,
      avatar: member.avatar,
    });
    setFormError("");
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError("");
  };

  const handleAvatarFile = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setFormError("Please upload an image file.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setFormError("Image must be smaller than 2 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({ ...prev, avatar: reader.result }));
      setFormError("");
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError("");

    if (!form.name.trim()) {
      setFormError("Name is required.");
      return;
    }

    guardAction(() => {
      const payload = {
        name: form.name,
        email: form.email,
        role: form.role,
        status: form.status,
        avatar: form.avatar,
      };

      const result = isEditing
        ? updateWarehouseStaffMember(editingId, payload)
        : createWarehouseStaffMember(payload);

      if (!result.ok) {
        setFormError(result.error);
        return;
      }

      refresh();
      showToast(
        isEditing ? `${form.name} updated successfully.` : `${form.name} added to warehouse staff.`,
        "success"
      );
      closeDrawer();
    });
  };

  const handleDelete = (member) => {
    guardAction(() => {
      const confirmed = window.confirm(
        `Remove ${member.name} from warehouse staff? This cannot be undone.`
      );
      if (!confirmed) return;

      const result = deleteWarehouseStaffMember(member.id);
      if (!result.ok) {
        showToast(result.error, "error");
        return;
      }

      refresh();
      showToast(`${member.name} removed from warehouse staff.`, "success");
    });
  };

  return (
    <>
      <PageCard
        title="Warehouse Staff"
        subtitle="Manage warehouse team members, roles, and access"
        action={
          <Button
            size="sm"
            color="blue"
            className="normal-case flex items-center gap-2"
            onClick={() => guardAction(openCreate)}
          >
            <PlusIcon className="h-4 w-4" />
            Add staff
          </Button>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b border-slate-100">
                {["Staff", "Email", "Role", "Status", ""].map((h) => (
                  <th
                    key={h || "actions"}
                    className="px-4 py-2 text-left text-xs font-semibold uppercase text-slate-400"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {staff.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm text-slate-500">
                    No warehouse staff yet. Click &quot;Add staff&quot; to create one.
                  </td>
                </tr>
              ) : (
                staff.map((member) => {
                  const status = statusMeta(member.status);
                  return (
                    <tr key={member.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <StaffAvatar avatar={member.avatar} name={member.name} size="md" />
                          <Typography className="text-sm font-medium text-slate-900">
                            {member.name}
                          </Typography>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">
                        {member.email || "—"}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge label={member.role} color="blue" />
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge label={status.label} color={status.color} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1">
                          <IconButton
                            variant="text"
                            size="sm"
                            onClick={() => guardAction(() => openEdit(member))}
                            aria-label={`Edit ${member.name}`}
                          >
                            <PencilSquareIcon className="h-4 w-4 text-slate-600" />
                          </IconButton>
                          <IconButton
                            variant="text"
                            size="sm"
                            onClick={() => handleDelete(member)}
                            aria-label={`Delete ${member.name}`}
                          >
                            <TrashIcon className="h-4 w-4 text-red-500" />
                          </IconButton>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </PageCard>

      <Drawer
        open={drawerOpen}
        onClose={closeDrawer}
        title={isEditing ? "Edit staff member" : "Add staff member"}
        subtitle="Warehouse team profile"
        width="max-w-md"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex flex-col items-center gap-3">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="group relative"
            >
              <StaffAvatarPreview avatar={form.avatar} name={form.name} />
              <span className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white shadow-md group-hover:bg-blue-700">
                <CameraIcon className="h-4 w-4" />
              </span>
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarFile}
            />
            <Typography variant="small" className="text-slate-500">
              Upload photo or pick from assets below
            </Typography>
          </div>

          {bundledAvatars.length > 0 && (
            <div>
              <Typography variant="small" className="mb-2 font-medium text-slate-600">
                From assets folder
              </Typography>
              <div className="flex flex-wrap gap-2">
                {bundledAvatars.map(({ slug, label, url }) => (
                  <button
                    key={slug}
                    type="button"
                    title={label}
                    onClick={() => setForm((prev) => ({ ...prev, avatar: slug }))}
                    className={`rounded-full ring-2 transition ${
                      form.avatar === slug ? "ring-blue-500" : "ring-transparent hover:ring-slate-300"
                    }`}
                  >
                    <img src={url} alt={label} className="h-10 w-10 rounded-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4">
            <Input
              label="Full name"
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              crossOrigin=""
              required
            />
            <Input
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
              crossOrigin=""
            />
            <div>
              <Typography variant="small" className="mb-1.5 font-medium text-slate-600">
                Role
              </Typography>
              <select
                className={selectClass}
                value={form.role}
                onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value }))}
              >
                {STAFF_ROLES.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Typography variant="small" className="mb-1.5 font-medium text-slate-600">
                Status
              </Typography>
              <select
                className={selectClass}
                value={form.status}
                onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
              >
                {STAFF_STATUSES.map(({ key, label }) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {formError && (
            <Typography className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {formError}
            </Typography>
          )}

          <div className="flex gap-3 pt-2">
            <Button type="submit" color="blue" className="normal-case flex-1">
              {isEditing ? "Save changes" : "Add staff member"}
            </Button>
            <Button type="button" variant="outlined" className="normal-case" onClick={closeDrawer}>
              Cancel
            </Button>
          </div>
        </form>
      </Drawer>
    </>
  );
}

export default WarehouseStaffManager;
