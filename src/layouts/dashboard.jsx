import { Routes, Route } from "react-router-dom";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { Sidenav } from "@/widgets/layout";
import { PermissionRoute } from "@/components/auth/PermissionRoute";
import { OrderSearchProvider } from "@/context/orderSearch";
import { useMaterialTailwindController, setOpenSidenav } from "@/context";
import routes from "@/routes";

export function Dashboard() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { openSidenav } = controller;

  return (
    <OrderSearchProvider>
    <div className="min-h-screen bg-slate-50">
      <Sidenav routes={routes} />
      <div className="flex min-h-screen flex-col xl:ml-[72px]">
        <button
          type="button"
          className="fixed left-3 top-3 z-40 flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm hover:bg-slate-50 xl:hidden"
          onClick={() => setOpenSidenav(dispatch, !openSidenav)}
          aria-label="Open menu"
        >
          <Bars3Icon className="h-5 w-5" />
        </button>
        <main className="flex-1 overflow-x-hidden p-3 pt-14 xl:p-4 xl:pt-4">
          <Routes>
            {routes.map(
              ({ layout, pages }) =>
                layout === "dashboard" &&
                pages.map(({ path, element, permission }) => (
                  <Route
                    key={path}
                    path={path}
                    element={
                      <PermissionRoute permission={permission}>{element}</PermissionRoute>
                    }
                  />
                ))
            )}
          </Routes>
        </main>
      </div>
    </div>
    </OrderSearchProvider>
  );
}

export default Dashboard;
