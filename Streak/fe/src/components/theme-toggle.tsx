import { useRef } from "react";
import { MoonIcon, SunIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  const buttonRef = useRef<HTMLButtonElement>(null);

  function handleClick() {
    const rect = buttonRef.current?.getBoundingClientRect();
    const origin = rect ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 } : undefined;
    setTheme(isDark ? "light" : "dark", origin);
  }

  return (
    <Button
      ref={buttonRef}
      type="button"
      variant="outline"
      size="icon"
      onClick={handleClick}
      aria-label={isDark ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"}
      className="relative rounded-full border-border bg-card hover:border-primary hover:bg-card"
    >
      <MoonIcon
        className="absolute size-[18px] transition-[opacity,transform] duration-200 ease-(--ease-out) motion-reduce:transition-opacity"
        style={{
          opacity: isDark ? 1 : 0,
          transform: isDark ? "rotate(0deg) scale(1)" : "rotate(-90deg) scale(0.5)",
        }}
      />
      <SunIcon
        className="absolute size-[18px] transition-[opacity,transform] duration-200 ease-(--ease-out) motion-reduce:transition-opacity"
        style={{
          opacity: isDark ? 0 : 1,
          transform: isDark ? "rotate(90deg) scale(0.5)" : "rotate(0deg) scale(1)",
        }}
      />
    </Button>
  );
}
