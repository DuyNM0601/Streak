import { ApiError, request } from "@/lib/api-client";
import { renewSession } from "../lib/session-store";

// Gọi endpoint cần đăng nhập: gắn access token, nếu BE trả 401 thì làm mới phiên bằng refresh token rồi thử lại đúng 1 lần.
// Token đọc từ store (không phải state của AuthProvider) để luôn là bản mới nhất.
export async function authedRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const call = (token: string) =>
    request<T>(path, { ...init, headers: { ...init?.headers, Authorization: `Bearer ${token}` } });

  let session = await renewSession();
  if (!session) throw new ApiError(401, "Bạn cần đăng nhập.");

  try {
    return await call(session.accessToken);
  } catch (e) {
    if (!(e instanceof ApiError) || e.status !== 401) throw e;
    session = await renewSession(session.accessToken);
    if (!session) throw e;
    return call(session.accessToken);
  }
}
