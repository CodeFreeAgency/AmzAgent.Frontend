import { useCallback } from "react";
import { useAuth } from "@/context/auth";
import { useToast } from "@/context/toast";
import { PERMISSIONS } from "@/lib/permissions";

const READ_ONLY_MESSAGE =
  "You have read-only access. Contact an administrator to make changes.";

export function useWriteGuard(permission = PERMISSIONS.SETTINGS_WRITE) {
  const { hasPermission } = useAuth();
  const { showToast } = useToast();
  const canWrite = hasPermission(permission);

  const guardAction = useCallback(
    (action, message = READ_ONLY_MESSAGE) => {
      if (!canWrite) {
        showToast(message, "warning");
        return false;
      }
      if (typeof action === "function") action();
      return true;
    },
    [canWrite, showToast]
  );

  return { canWrite, guardAction, readOnlyMessage: READ_ONLY_MESSAGE };
}
