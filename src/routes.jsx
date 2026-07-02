import {
  HomeIcon,
  ShoppingCartIcon,
  CubeIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/solid";
import { Home, Orders, Inventory, Settings } from "@/pages/dashboard";
import { SignIn } from "@/pages/auth";
import { PERMISSIONS } from "@/lib/permissions";

const icon = { className: "w-5 h-5" };

export const routes = [
  {
    layout: "dashboard",
    pages: [
      { icon: <HomeIcon {...icon} />, name: "Dashboard", path: "/home", element: <Home /> },
      { icon: <ShoppingCartIcon {...icon} />, name: "Orders", path: "/orders", element: <Orders /> },
      {
        icon: <CubeIcon {...icon} />,
        name: "Inventory",
        path: "/inventory",
        element: <Inventory />,
        permission: PERMISSIONS.INVENTORY_READ,
      },
      {
        icon: <Cog6ToothIcon {...icon} />,
        name: "Settings",
        path: "/settings",
        element: <Settings />,
        permission: PERMISSIONS.SETTINGS_READ,
      },
    ],
  },
  {
    layout: "auth",
    pages: [
      { name: "sign in", path: "/sign-in", element: <SignIn /> },
    ],
  },
];

export default routes;
