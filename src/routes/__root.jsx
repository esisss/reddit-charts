import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

const RootLayout = () => {
  return (
    <div className="min-h-screen bg-[#e0dcd0] dark:bg-gray-900 text-white">
      <Outlet />
      <TanStackRouterDevtools />
    </div>
  );
};

export const Route = createRootRoute({ component: RootLayout });
