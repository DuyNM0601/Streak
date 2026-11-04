import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { SiteHeader } from "./site-header";

export function Layout() {
  const { pathname } = useLocation();

  // BrowserRouter không tự reset scroll khi đổi trang.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col font-sans">
      <SiteHeader />
      <main key={pathname} className="page-in flex flex-1 flex-col">
        <Outlet />
      </main>
    </div>
  );
}
