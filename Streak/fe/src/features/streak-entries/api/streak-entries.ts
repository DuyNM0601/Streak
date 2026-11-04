// Gọi thẳng Streak.Api (xem Streak/BE/Streak.Api/Features/StreakEntries). Chưa có lớp xác thực
// nên các hàm này chưa dùng được cho tính năng thật - chỉ để FE có chỗ gọi API chuẩn, có kiểu rõ ràng.

import { request } from "@/lib/api-client";
import type { SearchStreakEntriesResult } from "../types";

export function createStreakEntry(userId: string, checkInDate: string) {
  return request<string>("/streak-entries", {
    method: "POST",
    body: JSON.stringify({ userId, checkInDate }),
  });
}

export function searchStreakEntries(params: { userId?: string; skip?: number; top?: number } = {}) {
  const query = new URLSearchParams();
  if (params.userId) query.set("userId", params.userId);
  if (params.skip) query.set("skip", String(params.skip));
  if (params.top) query.set("top", String(params.top));
  const qs = query.toString();
  return request<SearchStreakEntriesResult>(`/streak-entries${qs ? `?${qs}` : ""}`);
}
