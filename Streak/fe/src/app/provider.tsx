import type { ReactNode } from "react";
import { AuthModalProvider, AuthProvider } from "@/features/auth";
import { LoadingOverlayProvider } from "@/components/loading-overlay";
import { SmoothScroll } from "@/components/smooth-scroll";
import { ThemeProvider } from "@/components/theme-provider";

export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <SmoothScroll />
      {/* Nằm ngoài AuthProvider vì đăng nhập / đăng xuất / khôi phục phiên cũng dùng lớp loading toàn màn hình. */}
      <LoadingOverlayProvider>
        <AuthProvider>
          <AuthModalProvider>{children}</AuthModalProvider>
        </AuthProvider>
      </LoadingOverlayProvider>
    </ThemeProvider>
  );
}
