import { useState } from "react";
import PropTypes from "prop-types";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/auth";
import {
  XMarkIcon,
  ArrowRightOnRectangleIcon,
  BellIcon,
} from "@heroicons/react/24/outline";
import {
  IconButton,
  Typography,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import { UserAvatar } from "@/components/ui";
import { useMaterialTailwindController, setOpenSidenav } from "@/context";
import { getWarehouseData } from "@/data/warehouse";

const COLLAPSED_W = 72;
const EXPANDED_W = 256;

export function Sidenav({ routes }) {
  const navigate = useNavigate();
  const { user, logout, hasPermission } = useAuth();
  const [controller, dispatch] = useMaterialTailwindController();
  const { openSidenav } = controller;
  const [hovered, setHovered] = useState(false);
  const { notifications } = getWarehouseData();

  const isMobileOpen = openSidenav;
  const isExpanded = isMobileOpen || hovered;

  const handleLogout = () => {
    logout();
    navigate("/auth/sign-in");
  };

  return (
    <aside
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ width: isExpanded ? EXPANDED_W : COLLAPSED_W }}
      className={`fixed inset-y-0 left-0 z-50 flex flex-col overflow-hidden border-r border-slate-200/80 bg-white transition-all duration-300 ease-in-out ${
        isExpanded ? "shadow-xl" : "shadow-sm"
      } ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} xl:translate-x-0`}
    >
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center border-b border-slate-100 px-3">
        <Link
          to="/dashboard/home"
          className={`flex min-w-0 items-center gap-2.5 overflow-hidden ${isExpanded ? "" : "justify-center w-full"}`}
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-md">
            <span className="text-sm font-bold text-white">FA</span>
          </div>
          <div
            className={`min-w-0 transition-all duration-300 ${
              isExpanded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 w-0 overflow-hidden"
            }`}
          >
            <Typography className="whitespace-nowrap text-sm font-bold leading-tight text-slate-900">
              Fulfilment Agent
            </Typography>
          </div>
        </Link>
        <IconButton
          variant="text"
          size="sm"
          className="ml-auto shrink-0 xl:hidden"
          onClick={() => setOpenSidenav(dispatch, false)}
        >
          <XMarkIcon className="h-5 w-5" />
        </IconButton>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-4">
        {routes
          .filter(({ layout }) => layout === "dashboard")
          .map(({ pages }, key) => (
            <ul key={key} className="space-y-1">
              {pages
                .filter(({ permission }) => !permission || hasPermission(permission))
                .map(({ icon, name, path }) => (
                <li key={name}>
                  <NavLink to={`/dashboard${path}`} title={!isExpanded ? name : undefined}>
                    {({ isActive }) => (
                      <div
                        className={`group relative flex items-center rounded-xl py-2.5 text-sm font-medium transition-all duration-200 ${
                          isActive
                            ? "bg-blue-50 text-blue-700 shadow-sm"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        } ${isExpanded ? "gap-3 px-3" : "justify-center px-0"}`}
                      >
                        {isActive && (
                          <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-blue-600" />
                        )}
                        <span className={`shrink-0 ${isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"}`}>
                          {icon}
                        </span>
                        <span
                          className={`whitespace-nowrap capitalize transition-all duration-300 ${
                            isExpanded ? "opacity-100 translate-x-0" : "pointer-events-none w-0 opacity-0"
                          }`}
                        >
                          {name}
                        </span>
                      </div>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          ))}
      </nav>

      {/* Notifications, Account + Logout */}
      <div className="shrink-0 border-t border-slate-100 p-2">
        <Menu placement="right-end">
          <MenuHandler>
            <button
              type="button"
              title={!isExpanded ? "Notifications" : undefined}
              aria-label="Notifications"
              className={`relative flex w-full items-center rounded-xl py-2.5 text-sm font-medium text-slate-600 transition-all duration-200 hover:bg-slate-50 hover:text-slate-900 ${
                isExpanded ? "gap-3 px-3" : "justify-center px-0"
              }`}
            >
              <span className="relative shrink-0">
                <BellIcon className="h-5 w-5" strokeWidth={2} />
                {notifications.length > 0 && (
                  <span className="pointer-events-none absolute -right-1.5 -top-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white ring-2 ring-white">
                    {notifications.length}
                  </span>
                )}
              </span>
              <span
                className={`whitespace-nowrap transition-all duration-300 ${
                  isExpanded ? "opacity-100" : "w-0 opacity-0 overflow-hidden"
                }`}
              >
                Notifications
              </span>
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

        <div
          className={`mt-1 flex items-center overflow-hidden rounded-xl bg-slate-50 p-2 transition-all duration-300 ${
            isExpanded ? "gap-3" : "justify-center"
          }`}
          title={!isExpanded ? user?.name || "Account" : undefined}
        >
          <UserAvatar size="sm" src={user?.avatar} name={user?.name} />
          <div
            className={`min-w-0 flex-1 transition-all duration-300 ${
              isExpanded ? "opacity-100" : "w-0 opacity-0 overflow-hidden"
            }`}
          >
            <Typography className="truncate text-sm font-semibold text-slate-900">
              {user?.name || "Admin"}
            </Typography>
            <Typography className="truncate text-xs text-slate-500">
              {user?.roleLabel || "Administrator"}
            </Typography>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          title={!isExpanded ? "Logout" : undefined}
          className={`mt-1 flex w-full items-center rounded-xl py-2.5 text-sm font-medium text-slate-500 transition-all duration-200 hover:bg-red-50 hover:text-red-600 ${
            isExpanded ? "gap-3 px-3" : "justify-center px-0"
          }`}
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5 shrink-0" />
          <span
            className={`whitespace-nowrap transition-all duration-300 ${
              isExpanded ? "opacity-100" : "w-0 opacity-0 overflow-hidden"
            }`}
          >
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
}

Sidenav.propTypes = {
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Sidenav;
