import { Link, NavLink } from "react-router-dom";
import { useAuthModal } from "@/features/auth";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

// Gạch chân trượt ra từ trái khi hover; trang đang active giữ nguyên gạch chân.
const navLink =
  "relative py-1 transition-colors duration-500 ease-(--ease-hover) hover:text-foreground after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-primary after:transition-transform after:duration-500 after:ease-(--ease-hover) hover:after:scale-x-100";

export function SiteHeader() {
  const { open } = useAuthModal();

  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-semibold">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="13" r="8" />
              <path d="M12 9v4l2.5 2M9 2.5h6" />
            </svg>
          </span>
          Streak
        </Link>
        <nav aria-label="Điều hướng chính" className="hidden items-center gap-6 text-sm font-medium text-muted-foreground sm:flex">
          <NavLink to="/" end className={({ isActive }) => `${navLink} ${isActive ? "text-foreground after:scale-x-100" : ""}`}>
            Trang chủ
          </NavLink>
          <NavLink to="/guide" className={({ isActive }) => `${navLink} ${isActive ? "text-foreground after:scale-x-100" : ""}`}>
            Hướng dẫn
          </NavLink>
        </nav>
        <div className="flex items-center gap-3">
          <Button type="button" onClick={open} className="h-10 rounded-full px-5 text-sm font-semibold">
            Đăng nhập
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
