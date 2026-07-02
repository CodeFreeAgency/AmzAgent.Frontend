const STORAGE_KEY = "fa_warehouse_staff";

export const STAFF_ROLES = ["Manager", "Picker", "Packer"];
export const STAFF_STATUSES = [
  { key: "active", label: "Active", color: "green" },
  { key: "inactive", label: "Inactive", color: "gray" },
];

export const SEED_WAREHOUSE_STAFF = [
  {
    id: "staff-alex",
    name: "Alex Morgan",
    email: "alex.morgan@fulfilment.local",
    role: "Manager",
    status: "active",
    avatar: "alex-morgan",
  },
  {
    id: "staff-sarah",
    name: "Sarah Chen",
    email: "sarah.chen@fulfilment.local",
    role: "Picker",
    status: "active",
    avatar: "sarah-chen",
  },
  {
    id: "staff-marcus",
    name: "Marcus Johnson",
    email: "marcus.johnson@fulfilment.local",
    role: "Packer",
    status: "active",
    avatar: "marcus-johnson",
  },
];

function readStaff() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function writeStaff(staff) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(staff));
}

export function ensureWarehouseStaff() {
  const existing = readStaff();
  if (!existing) {
    writeStaff(SEED_WAREHOUSE_STAFF);
    return;
  }
  const merged = [...existing];
  SEED_WAREHOUSE_STAFF.forEach((seed) => {
    if (!merged.some((s) => s.id === seed.id)) {
      merged.push(seed);
    }
  });
  writeStaff(merged);
}

export function getWarehouseStaff() {
  ensureWarehouseStaff();
  return readStaff() || [...SEED_WAREHOUSE_STAFF];
}

export function createWarehouseStaffMember(data) {
  const staff = getWarehouseStaff();
  const email = data.email?.trim().toLowerCase();

  if (email && staff.some((s) => s.email?.toLowerCase() === email)) {
    return { ok: false, error: "A staff member with this email already exists." };
  }

  const member = {
    id: `staff-${Date.now()}`,
    name: data.name.trim(),
    email: email || "",
    role: data.role,
    status: data.status || "active",
    avatar: data.avatar || null,
  };

  writeStaff([...staff, member]);
  return { ok: true, member };
}

export function updateWarehouseStaffMember(id, data) {
  const staff = getWarehouseStaff();
  const index = staff.findIndex((s) => s.id === id);
  if (index === -1) return { ok: false, error: "Staff member not found." };

  const email = data.email?.trim().toLowerCase();
  if (email && staff.some((s) => s.id !== id && s.email?.toLowerCase() === email)) {
    return { ok: false, error: "A staff member with this email already exists." };
  }

  const updated = {
    ...staff[index],
    name: data.name.trim(),
    email: email || "",
    role: data.role,
    status: data.status,
    avatar: data.avatar ?? staff[index].avatar,
  };

  const next = [...staff];
  next[index] = updated;
  writeStaff(next);
  return { ok: true, member: updated };
}

export function deleteWarehouseStaffMember(id) {
  const staff = getWarehouseStaff();
  const next = staff.filter((s) => s.id !== id);
  if (next.length === staff.length) {
    return { ok: false, error: "Staff member not found." };
  }
  writeStaff(next);
  return { ok: true };
}
