import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { LoadingSpinner } from "@/components/loading";

// Lớp loading phủ TOÀN màn hình, chặn mọi thao tác trong lúc chờ. Dùng cho việc làm đổi cả màn hình
// (đăng nhập, đăng xuất, khôi phục phiên, tải dữ liệu của trang). Việc nhỏ trong một khối (lưu form, bật/tắt)
// dùng LoadingButton / LoadingSpinner tại chỗ.
//
// Hai cách dùng:
//   - Khai báo:  {đang chờ && <FullScreenLoading label="Đang tải..." />}   (hiện khi component được render)
//   - Mệnh lệnh: const hide = useLoadingOverlay().show("Đang đăng xuất..."); try {...} finally { hide(); }
// Nhiều nơi cùng yêu cầu thì lớp phủ chỉ hiện một cái (nhãn của yêu cầu mới nhất), tắt khi hết yêu cầu.

type Entry = { id: number; label: string };

const LoadingOverlayContext = createContext<{ show: (label: string) => () => void } | null>(null);

export function LoadingOverlayProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const nextId = useRef(0);

  const show = useCallback((label: string) => {
    const id = nextId.current++;
    setEntries((prev) => [...prev, { id, label }]);
    return () => setEntries((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const value = useMemo(() => ({ show }), [show]);
  const current = entries.at(-1);

  return (
    <LoadingOverlayContext.Provider value={value}>
      {children}
      {current && (
        // Chặn chuột ngay lập tức nhưng chỉ hiện sau ~120ms: việc xong rất nhanh thì không nháy lớp phủ lên rồi tắt.
        // shortcut: bàn phím vẫn Tab được xuống nội dung bên dưới; thêm `inert` cho phần còn lại của trang khi cần chặn hẳn.
        <div className="fixed inset-0 z-[100] flex animate-in items-center justify-center bg-background/70 backdrop-blur-[2px] duration-200 fill-mode-backwards delay-100 fade-in-0">
          <div role="status" aria-live="polite" className="paper flex items-center gap-3 rounded-md px-6 py-4 shadow-lg">
            <LoadingSpinner className="size-5 text-calendar-red" />
            <span className="text-sm font-semibold">{current.label}</span>
          </div>
        </div>
      )}
    </LoadingOverlayContext.Provider>
  );
}

export function useLoadingOverlay() {
  const ctx = useContext(LoadingOverlayContext);
  if (!ctx) throw new Error("useLoadingOverlay phải dùng trong LoadingOverlayProvider");
  return ctx;
}

export function FullScreenLoading({ label }: { label: string }) {
  const { show } = useLoadingOverlay();
  useEffect(() => show(label), [show, label]);
  return null;
}
