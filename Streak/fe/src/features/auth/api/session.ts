import { request } from "@/lib/api-client";
import type { AuthSession } from "../types";

// Refresh token nằm trong cookie HttpOnly do BE đặt, JS không đọc được; trình duyệt tự gửi kèm (credentials: include).
export function refreshSession() {
  return request<AuthSession>("/auth/refresh", { method: "POST" });
}

// BE thu hồi refresh token và xoá cookie.
export function logout() {
  return request<void>("/auth/logout", { method: "POST" });
}
