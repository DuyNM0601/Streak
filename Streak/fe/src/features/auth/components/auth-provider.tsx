import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { googleClientId } from "@/config/env";
import type { AuthSession } from "../types";

const STORAGE_KEY = "streak-session";

type AuthContextValue = {
  session: AuthSession | null;
  signIn: (session: AuthSession) => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

// shortcut: JWT lưu trong localStorage (XSS đọc được), đủ cho giai đoạn học; nâng lên cookie HttpOnly khi làm thật.
function readSession(): AuthSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const saved = JSON.parse(raw) as AuthSession;
    return new Date(saved.expiresAt) > new Date() ? saved : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(readSession);

  const signIn = useCallback((next: AuthSession) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setSession(next);
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setSession(null);
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
