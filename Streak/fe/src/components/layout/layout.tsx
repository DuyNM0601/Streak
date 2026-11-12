import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { BottomDock } from "./bottom-dock";
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
      {/* pb-24: chừa chỗ cho BottomDock (chỉ có trên điện thoại) để không che cuối trang. */}
      <main key={pathname} className="page-in flex flex-1 flex-col pb-24 sm:pb-0">
        <Outlet />
      </main>
      <BottomDock />
    </div>
  );
}
