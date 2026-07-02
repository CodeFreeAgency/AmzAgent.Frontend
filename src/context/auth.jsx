import React from "react";
import PropTypes from "prop-types";
import {
  ensureSeedUsers,
  validateCredentials,
  toSessionUser,
} from "@/lib/users";
import { hasPermission as checkPermission, getRoleLabel } from "@/lib/permissions";

const SESSION_KEY = "fa_session";
const AuthContext = React.createContext(null);

function loadSession() {
  try {
    const stored = sessionStorage.getItem(SESSION_KEY);
    if (!stored) return null;
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  ensureSeedUsers();

  const [user, setUser] = React.useState(() => loadSession());

  const persistSession = (sessionUser) => {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
    setUser(sessionUser);
  };

  const login = (email, password) => {
    const account = validateCredentials(email, password);
    if (!account) {
      return { ok: false, error: "Invalid email or password." };
    }
    const sessionUser = {
      ...toSessionUser(account),
      roleLabel: getRoleLabel(account.role),
    };
    persistSession(sessionUser);
    return { ok: true, user: sessionUser };
  };

  const logout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setUser(null);
  };

  const hasPermission = (permission) => {
    if (!user?.role) return false;
    return checkPermission(user.role, permission);
  };

  const value = React.useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isAdmin: user?.role === "admin",
      login,
      logout,
      hasPermission,
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = { children: PropTypes.node.isRequired };

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
