import { apiBaseUrl } from "@/config/env";

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${apiBaseUrl}${path}`, {
    // include: gửi/nhận cookie refresh token của BE (khác origin nên mặc định bị bỏ).
    credentials: "include",
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new ApiError(res.status, body?.title ?? body?.detail ?? `Lỗi ${res.status}`);
  }

  return res.status === 204 ? (undefined as T) : res.json();
}
