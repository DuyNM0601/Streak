import { useEffect, useState } from "react";
import { CalendarSheet } from "@/components/calendar-sheet";
import { FullScreenLoading } from "@/components/loading-overlay";
import { Button } from "@/components/ui/button";
import { useAuth, useAuthModal } from "@/features/auth";
import { listReminders } from "../api/reminders";
import type { Reminder } from "../types";
import { ReminderForm } from "./reminder-form";
import { ReminderList } from "./reminder-list";

export function RemindersPanel() {
  const { session } = useAuth();
  const { open } = useAuthModal();
  // Theo userId chứ không theo cả session: access token được làm mới mỗi 15 phút, không cần tải lại danh sách.
  const userId = session?.userId;

  const [reminders, setReminders] = useState<Reminder[] | null>(null);
  const [failed, setFailed] = useState(false);
  // Chỉ nhớ id đang sửa, còn nhắc nhở lấy từ danh sách: bật/tắt trong lúc đang sửa thì form lưu theo trạng thái mới nhất.
  const [editingId, setEditingId] = useState<string | null>(null);
  const editing = reminders?.find((r) => r.id === editingId) ?? null;

  useEffect(() => {
    setReminders(null);
    setFailed(false);
    setEditingId(null);
    if (!userId) return;

    let cancelled = false;
    listReminders().then(
      (list) => !cancelled && setReminders(list),
      () => !cancelled && setFailed(true),
    );
    return () => {
      cancelled = true;
    };
  }, [userId]);

  // Tạo mới thì thêm vào, sửa / bật-tắt thì thay đúng dòng cũ; luôn xếp lại theo giờ.
  const replace = (saved: Reminder) =>
    setReminders((prev) => [...(prev ?? []).filter((r) => r.id !== saved.id), saved].sort(byTime));

  if (!session) {
    return (
      <CalendarSheet band="Nhắc nhở" className="max-w-md" bodyClassName="flex flex-col items-start gap-4 px-6 py-6">
        <p className="text-sm text-muted-foreground">Đăng nhập để tạo và xem nhắc nhở của bạn.</p>
        <Button type="button" onClick={open} className="press h-11 rounded-full px-6 font-semibold">
          Đăng nhập
        </Button>
      </CalendarSheet>
    );
  }

  return (
    <div className="grid gap-8 md:grid-cols-5">
      <CalendarSheet band={editing ? "Sửa nhắc nhở" : "Tạo nhắc nhở"} className="md:col-span-2">
        <ReminderForm
          key={editing?.id ?? "new"}
          editing={editing ?? undefined}
          onCancel={() => setEditingId(null)}
          onSaved={(saved) => {
            replace(saved);
            setEditingId(null);
          }}
        />
      </CalendarSheet>

      <CalendarSheet band="Nhắc nhở của bạn" className="md:col-span-3">
        {failed ? (
          <p className="px-6 py-8 text-sm text-muted-foreground">Không tải được danh sách. Hãy thử tải lại trang.</p>
        ) : reminders === null ? (
          // Lớp phủ toàn màn hình đang che; khối này để trống cho tới khi có dữ liệu.
          <FullScreenLoading label="Đang tải nhắc nhở..." />
        ) : (
          <ReminderList
            reminders={reminders}
            editingId={editingId ?? undefined}
            onEdit={(r) => setEditingId(r.id)}
            onChanged={replace}
            onDeleted={(id) => {
              setReminders((prev) => (prev ?? []).filter((r) => r.id !== id));
              setEditingId((current) => (current === id ? null : current));
            }}
          />
        )}
      </CalendarSheet>
    </div>
  );
}

// BE trả danh sách đã sắp theo giờ; nhắc nhở mới thêm vào cũng phải đứng đúng chỗ ("HH:mm:ss" so sánh chuỗi được).
const byTime = (a: Reminder, b: Reminder) => a.timeOfDay.localeCompare(b.timeOfDay);
