import { Link, NavLink } from "react-router-dom";
import { SignOutButton, useAuth, useAuthModal } from "@/features/auth";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

// Gạch chân trượt ra từ trái khi hover; trang đang active giữ nguyên gạch chân.
const navLink =
  "relative py-1 transition-colors duration-500 ease-(--ease-hover) hover:text-foreground after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-primary after:transition-transform after:duration-500 after:ease-(--ease-hover) hover:after:scale-x-100";

export function SiteHeader() {
  const { open } = useAuthModal();
  const { session } = useAuth();

  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <Link to="/" className="flex items-center gap-2.5 font-display text-lg font-extrabold tracking-tight">
          {/* Biểu tượng: tờ lịch nhỏ, dải đỏ + lỗ treo */}
          <svg width="26" height="28" viewBox="0 0 26 28" aria-hidden="true">
            <rect x="1" y="1" width="24" height="26" rx="2.5" className="fill-card" stroke="currentColor" strokeWidth="1.6" />
            <path d="M1 3.5A2.5 2.5 0 0 1 3.5 1h19A2.5 2.5 0 0 1 25 3.5V9H1V3.5Z" className="fill-calendar-red" />
            <circle cx="6" cy="5" r="1.3" className="fill-card" />
            <path d="M8 21 11.5 14l2.6 4.6 2-3.1L18.5 21" fill="none" className="stroke-ink" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Streak
        </Link>
        <nav aria-label="Điều hướng chính" className="hidden items-center gap-6 text-sm font-semibold text-muted-foreground sm:flex">
          <NavLink to="/" end className={({ isActive }) => `${navLink} ${isActive ? "text-foreground after:scale-x-100" : ""}`}>
            Trang chủ
          </NavLink>
          <NavLink to="/guide" className={({ isActive }) => `${navLink} ${isActive ? "text-foreground after:scale-x-100" : ""}`}>
            Hướng dẫn
          </NavLink>
          <NavLink to="/reminders" className={({ isActive }) => `${navLink} ${isActive ? "text-foreground after:scale-x-100" : ""}`}>
            Nhắc nhở
          </NavLink>
        </nav>
        <div className="flex items-center gap-3">
          {session ? (
            <>
              <span className="hidden max-w-40 truncate text-sm font-semibold sm:inline">{session.displayName}</span>
              <SignOutButton />
            </>
          ) : (
            <Button type="button" onClick={open} className="h-10 rounded-full px-5 text-sm font-semibold">
              Đăng nhập
            </Button>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
