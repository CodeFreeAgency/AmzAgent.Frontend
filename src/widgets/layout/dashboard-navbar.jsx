import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/auth";
import { PERMISSIONS } from "@/lib/permissions";
import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import {
  BellIcon,
  Bars3Icon,
  CalendarDaysIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  UsersIcon,
  ClipboardDocumentListIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { useMaterialTailwindController, setOpenSidenav } from "@/context";
import { getWarehouseData } from "@/data/warehouse";
import { UserAvatar, OrderSearchInput } from "@/components/ui";
import { DATE_PRESETS, formatDateRangeLabel } from "@/utils/dateRange";

const DISPLAY_NAME = "Admin";

export function DashboardNavbar() {
  const navigate = useNavigate();
  const { user, logout, hasPermission, isAdmin } = useAuth();
  const canAccessSettings = hasPermission(PERMISSIONS.SETTINGS_READ);
  const [controller, dispatch] = useMaterialTailwindController();
  const { openSidenav } = controller;
  const [dateRange, setDateRange] = useState("today");
  const { notifications } = getWarehouseData();

  const handleLogout = () => {
    logout();
    navigate("/auth/sign-in");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white px-4 py-2.5 shadow-sm xl:px-6">
      <div className="flex flex-wrap items-center gap-3 text-slate-800">
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 xl:hidden"
          onClick={() => setOpenSidenav(dispatch, !openSidenav)}
        >
          <Bars3Icon className="h-5 w-5 text-slate-600" />
        </button>

        <OrderSearchInput />

        {isAdmin && (
          <Menu placement="bottom">
            <MenuHandler>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-800 shadow-sm transition-colors hover:bg-slate-50"
              >
                <CalendarDaysIcon className="h-5 w-5 shrink-0 text-slate-600" strokeWidth={1.5} />
                <span className="whitespace-nowrap text-slate-800">{formatDateRangeLabel(dateRange)}</span>
              </button>
            </MenuHandler>
            <MenuList className="text-slate-800">
              {DATE_PRESETS.map(({ key, label }) => (
                <MenuItem
                  key={key}
                  onClick={() => setDateRange(key)}
                  className={`text-slate-700 ${dateRange === key ? "font-semibold text-blue-600" : ""}`}
                >
                  {label}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        )}

        <div className="ml-auto flex items-center gap-2">
          <Menu placement="bottom-end">
            <MenuHandler>
              <button
                type="button"
                className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
                aria-label="Notifications"
              >
                <BellIcon className="h-5 w-5 text-slate-700" strokeWidth={2} />
                {notifications.length > 0 && (
                  <span className="pointer-events-none absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white ring-2 ring-white">
                    {notifications.length}
                  </span>
                )}
              </button>
            </MenuHandler>
            <MenuList className="max-h-80 w-80 overflow-y-auto p-0 text-slate-800">
              <div className="border-b border-slate-100 px-4 py-3">
                <p className="text-sm font-bold text-slate-900">Notifications</p>
                <p className="text-xs text-slate-500">{notifications.length} unread</p>
              </div>
              {notifications.map((n) => (
                <MenuItem key={n.id} className="flex flex-col items-start gap-0.5 py-3 text-slate-800">
                  <span className="text-sm text-slate-800">{n.title}</span>
                  <span className="text-xs text-slate-400">{n.time}</span>
                </MenuItem>
              ))}
            </MenuList>
          </Menu>

          <Menu placement="bottom-end">
            <MenuHandler>
              <button
                type="button"
                className="flex min-w-[120px] items-center gap-2.5 rounded-xl border border-slate-200 bg-white py-1.5 pl-1.5 pr-4 text-slate-800 shadow-sm transition-colors hover:bg-slate-50"
              >
                <UserAvatar size="sm" src={user?.avatar} name={user?.name} />
                <span className="text-sm font-semibold text-slate-800">{user?.name || DISPLAY_NAME}</span>
              </button>
            </MenuHandler>
            <MenuList className="text-slate-800">
              <div className="border-b border-slate-100 px-3 py-2">
                <p className="text-sm font-bold text-slate-900">{user?.name || DISPLAY_NAME}</p>
                <p className="text-xs text-slate-500">{user?.roleLabel || "Administrator"}</p>
              </div>
              <MenuItem className="flex items-center gap-2 text-slate-700">
                <UserCircleIcon className="h-4 w-4 text-slate-600" /> Profile
              </MenuItem>
              <MenuItem className="flex items-center gap-2 text-slate-700">
                <UsersIcon className="h-4 w-4 text-slate-600" /> Team
              </MenuItem>
              <MenuItem className="flex items-center gap-2 text-slate-700">
                <ClipboardDocumentListIcon className="h-4 w-4 text-slate-600" /> Activity Logs
              </MenuItem>
              {canAccessSettings && (
                <MenuItem className="flex items-center gap-2 text-slate-700">
                  <Link to="/dashboard/settings" className="flex items-center gap-2 text-slate-700">
                    <Cog6ToothIcon className="h-4 w-4 text-slate-600" /> Settings
                  </Link>
                </MenuItem>
              )}
              <hr className="my-1 border-slate-100" />
              <MenuItem className="flex items-center gap-2 text-red-600" onClick={handleLogout}>
                <ArrowRightOnRectangleIcon className="h-4 w-4" /> Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </div>
      </div>
    </header>
  );
}

export default DashboardNavbar;
