import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { searchStreakEntries } from "../api/streak-entries";

type Status = { state: "loading" } | { state: "ok"; totalCount: number } | { state: "error"; message: string };

export function ApiStatus() {
  const [status, setStatus] = useState<Status>({ state: "loading" });

  useEffect(() => {
    searchStreakEntries({ top: 1 })
      .then((res) => setStatus({ state: "ok", totalCount: res.totalCount }))
      .catch((err) => setStatus({ state: "error", message: err instanceof Error ? err.message : "Không gọi được API" }));
  }, []);

  if (status.state === "loading") {
    return <p className="text-xs text-muted-foreground">Đang kiểm tra kết nối backend…</p>;
  }

  if (status.state === "error") {
    return (
      <Badge variant="outline" className="notice-enter bg-card py-1.5 text-xs text-warning">
        Chưa gọi được backend: {status.message}
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="notice-enter gap-2 bg-card py-1.5 text-xs text-success">
      <span className="h-1.5 w-1.5 rounded-full bg-success" />
      Đã kết nối backend · {status.totalCount} lần check-in trong database
    </Badge>
  );
}
