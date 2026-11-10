import { ApiError } from "@/lib/api-client";
import { refreshSession } from "../api/session";
import type { AuthSession } from "../types";

export const STORAGE_KEY = "streak-session";
// Làm mới access token trước khi hết hạn khoảng này.
export const REFRESH_SKEW_MS = 60_000;

// shortcut: access token lưu trong localStorage (XSS đọc được) vì chỉ sống 15 phút; refresh token mới là thứ quan trọng và nằm ở cookie HttpOnly.
export function readStored(): AuthSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuthSession) : null;
  } catch {
    return null;
  }
}

export function persist(session: AuthSession | null) {
  if (session) localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  else localStorage.removeItem(STORAGE_KEY);
}

export const isFresh = (s: AuthSession) => new Date(s.expiresAt).getTime() - Date.now() > REFRESH_SKEW_MS;

// Web Lock để nhiều tab (hoặc StrictMode) không cùng đổi một refresh token: BE xoay token và coi dùng lại token cũ là bị đánh cắp.
// Tab vào sau thấy phiên đã được tab trước làm mới thì dùng luôn, không gọi API nữa.
// rejectedToken: access token vừa bị BE từ chối (401); phiên trong store vẫn là token đó thì phải đổi dù chưa hết hạn theo đồng hồ.
export function renewSession(rejectedToken?: string): Promise<AuthSession | null> {
  return navigator.locks.request("streak-refresh", async () => {
    const stored = readStored();
    if (stored && isFresh(stored) && stored.accessToken !== rejectedToken) return stored;
    try {
      const next = await refreshSession();
      persist(next);
      return next;
    } catch (e) {
      // 401 = cookie hết hạn / đã bị thu hồi: bỏ phiên. Lỗi khác (mạng, 5xx) thì ném tiếp, giữ phiên để người gọi thử lại.
      if (e instanceof ApiError && e.status === 401) {
        persist(null);
        return null;
      }
      throw e;
    }
  });
}
