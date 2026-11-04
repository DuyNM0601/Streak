import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { flushSync } from "react-dom";

type Theme = "light" | "dark";
type ThemeOrigin = { x: number; y: number };

const STORAGE_KEY = "streak-theme";

const ThemeContext = createContext<{ theme: Theme; setTheme: (t: Theme, origin?: ThemeOrigin) => void } | null>(null);

function readStoredTheme(): Theme {
  try {
    return localStorage.getItem(STORAGE_KEY) === "light" ? "light" : "dark";
  } catch {
    return "dark";
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(readStoredTheme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // localStorage có thể bị chặn (private mode) - bỏ qua, không ảnh hưởng chức năng chính.
    }
  }, [theme]);

  function setTheme(next: Theme, origin?: ThemeOrigin) {
    const apply = () => {
      document.documentElement.classList.toggle("dark", next === "dark");
      flushSync(() => setThemeState(next));
    };

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!document.startViewTransition || reduce) {
      apply();
      return;
    }

    // Vòng tròn loang ra từ vị trí bấm (giống GitHub/Vercel) thay vì crossfade phẳng mặc định của
    // View Transitions - rõ ràng hơn là "đổi màu cái rụp". Animation thật khai báo bằng @keyframes
    // ở index.css (theme-reveal), ở đây chỉ set toạ độ/bán kính qua custom property.
    const x = origin?.x ?? window.innerWidth / 2;
    const y = origin?.y ?? window.innerHeight / 2;
    const endRadius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

    const root = document.documentElement;
    root.style.setProperty("--theme-toggle-x", `${x}px`);
    root.style.setProperty("--theme-toggle-y", `${y}px`);
    root.style.setProperty("--theme-toggle-r", `${endRadius}px`);

    document.startViewTransition(apply);
  }

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme phải dùng trong ThemeProvider");
  return ctx;
}
