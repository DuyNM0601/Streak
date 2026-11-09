import type { ReactNode } from "react";
import { AuthModalProvider, AuthProvider } from "@/features/auth";
import { SmoothScroll } from "@/components/smooth-scroll";
import { ThemeProvider } from "@/components/theme-provider";

export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <SmoothScroll />
      <AuthProvider>
        <AuthModalProvider>{children}</AuthModalProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
