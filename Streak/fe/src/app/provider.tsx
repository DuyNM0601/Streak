import type { ReactNode } from "react";
import { AuthModalProvider } from "@/features/auth";
import { SmoothScroll } from "@/components/smooth-scroll";
import { ThemeProvider } from "@/components/theme-provider";

export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <SmoothScroll />
      <AuthModalProvider>{children}</AuthModalProvider>
    </ThemeProvider>
  );
}
