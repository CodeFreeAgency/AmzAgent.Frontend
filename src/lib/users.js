import { ROLES } from "@/lib/permissions";

const USERS_STORAGE_KEY = "fa_users";

const LEGACY_SEED_EMAILS = {
  "seed-admin": "admin@gmail.com",
  "seed-user": "user@gmail.com",
};

const LEGACY_SEED_PASSWORD = "fulfillment@123";

export const SEED_USERS = [
  {
    id: "seed-admin",
    email: "admin@sellingpartnerservices.com",
    password: "Demo@123",
    role: ROLES.ADMIN,
    name: "Admin",
    avatar: null,
  },
  {
    id: "seed-user",
    email: "user@sellingpartnerservices.com",
    password: "Demo@123",
    role: ROLES.USER,
    name: "User",
    avatar: null,
  },
];

function readUsers() {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function writeUsers(users) {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

export function ensureSeedUsers() {
  const existing = readUsers();
  if (!existing) {
    writeUsers(SEED_USERS);
    return;
  }
  const merged = [...existing];
  SEED_USERS.forEach((seed) => {
    const byId = merged.find((u) => u.id === seed.id);
    if (byId) {
      const legacyEmail = LEGACY_SEED_EMAILS[seed.id];
      if (legacyEmail && byId.email.toLowerCase() === legacyEmail) {
        byId.email = seed.email;
      }
      if (byId.password === LEGACY_SEED_PASSWORD) {
        byId.password = seed.password;
      }
      return;
    }
    if (!merged.some((u) => u.email.toLowerCase() === seed.email.toLowerCase())) {
      merged.push(seed);
    }
  });
  writeUsers(merged);
}

export function getAllUsers() {
  ensureSeedUsers();
  return readUsers() || [...SEED_USERS];
}

export function findUserByEmail(email) {
  const normalized = email?.trim().toLowerCase();
  return getAllUsers().find((u) => u.email.toLowerCase() === normalized) || null;
}

export function validateCredentials(email, password) {
  const user = findUserByEmail(email);
  if (!user || user.password !== password) return null;
  return user;
}

export function registerUser({ email, password, avatar, name }) {
  const normalized = email.trim().toLowerCase();
  if (findUserByEmail(normalized)) {
    return { ok: false, error: "An account with this email already exists." };
  }

  const users = getAllUsers();
  const newUser = {
    id: `user-${Date.now()}`,
    email: normalized,
    password,
    role: ROLES.USER,
    name: name?.trim() || normalized.split("@")[0],
    avatar: avatar || null,
  };

  writeUsers([...users, newUser]);
  return { ok: true, user: newUser };
}

export function toSessionUser(user) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    avatar: user.avatar,
  };
}
