import { BellRing, BookOpen, House } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

const items = [
  { to: "/", label: "Trang chủ", icon: House, end: true },
  { to: "/reminders", label: "Nhắc nhở", icon: BellRing, end: false },
  { to: "/guide", label: "Hướng dẫn", icon: BookOpen, end: false },
];

// Thanh điều hướng nổi ở giữa đáy màn hình, chỉ trên điện thoại: header ẩn link điều hướng dưới `sm`
// nên đây là cách duy nhất để chuyển trang. Là một dải giấy dán trên tường (.paper) cho hợp giao diện tờ lịch.
export function BottomDock() {
  return (
    <nav
      aria-label="Điều hướng chính"
      className="paper fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] left-1/2 z-10 flex -translate-x-1/2 gap-1 rounded-full p-1.5 shadow-lg sm:hidden"
    >
      {items.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            cn(
              "press flex min-w-20 flex-col whitespace-nowrap items-center gap-0.5 rounded-full px-3 py-1.5 text-[0.7rem] font-semibold transition-colors duration-300",
              isActive ? "bg-calendar-red text-white" : "text-muted-foreground hover:text-foreground",
            )
          }
        >
          <Icon className="size-5" aria-hidden="true" />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
