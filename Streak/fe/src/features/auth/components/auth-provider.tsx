import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { GoogleOAuthProvider, googleLogout } from "@react-oauth/google";
import { googleClientId } from "@/config/env";
import { logout } from "../api/session";
import { REFRESH_SKEW_MS, STORAGE_KEY, isFresh, persist, readStored, renewSession } from "../lib/session-store";
import type { AuthSession } from "../types";

const RETRY_MS = 15_000;

type AuthContextValue = {
  session: AuthSession | null;
  signIn: (session: AuthSession) => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(() => {
    const stored = readStored();
    return stored && isFresh(stored) ? stored : null;
  });

  useEffect(() => {
    let cancelled = false;
    let retryId: ReturnType<typeof setTimeout> | undefined;
    const renew = async () => {
      try {
        const next = await renewSession();
        if (!cancelled) setSession(next);
      } catch {
        // Lỗi mạng / BE tạm lỗi: giữ nguyên phiên, thử lại sau (không đăng xuất oan).
        if (!cancelled) retryId = setTimeout(renew, RETRY_MS);
      }
    };

    let timerId: ReturnType<typeof setTimeout> | undefined;
    if (session) {
      // Hẹn làm mới ngay trước khi access token hết hạn.
      const delay = Math.max(new Date(session.expiresAt).getTime() - Date.now() - REFRESH_SKEW_MS, 0);
      timerId = setTimeout(renew, delay);
    } else if (readStored()) {
      // Có phiên cũ đã hết hạn trong localStorage: thử đổi bằng refresh token (cookie) thay vì bắt đăng nhập lại.
      void renew();
    }
    return () => {
      cancelled = true;
      clearTimeout(timerId);
      clearTimeout(retryId);
    };
  }, [session]);

  // Tab khác đăng nhập / đăng xuất / làm mới thì tab này theo ngay (sự kiện storage chỉ bắn ở các tab còn lại).
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setSession(readStored());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const signIn = useCallback((next: AuthSession) => {
    persist(next);
    setSession(next);
  }, []);

  const signOut = useCallback(() => {
    persist(null);
    setSession(null);
    googleLogout(); // tắt tự chọn tài khoản của Google để lần sau phải chọn lại
    // Thu hồi refresh token ở BE; lỗi mạng cũng không chặn đăng xuất phía FE.
    logout().catch(() => {});
  }, []);

  return (
    <GoogleOAuthProvider clientId={googleClientId} locale="vi">
      <AuthContext.Provider value={{ session, signIn, signOut }}>{children}</AuthContext.Provider>
    </GoogleOAuthProvider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth phải dùng trong AuthProvider");
  return ctx;
}
