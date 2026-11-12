import { useState } from "react";
import { LoadingSpinner } from "@/components/loading";
import { Switch } from "@/components/ui/switch";
import { updateReminder } from "../api/reminders";
import type { Reminder } from "../types";

// Bật/tắt nhắc nhở: gửi lại toàn bộ nhắc nhở với IsActive đảo ngược (BE chỉ có PUT, không có PATCH).
// Chờ BE trả lời mới đổi trạng thái hiển thị, nên công tắc luôn phản ánh đúng dữ liệu thật.
export function ActiveSwitch({ reminder, onChanged }: { reminder: Reminder; onChanged: (reminder: Reminder) => void }) {
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  async function toggle(isActive: boolean) {
    setBusy(true);
    setFailed(false);
    try {
      onChanged(
        await updateReminder(reminder.id, {
          title: reminder.title,
          timeOfDay: reminder.timeOfDay,
          timeZoneId: reminder.timeZoneId,
          days: reminder.days,
          isActive,
        }),
      );
    } catch {
      setFailed(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      {busy && <LoadingSpinner className="size-3.5 text-calendar-red" />}
      {failed && (
        <span role="alert" className="text-xs text-warning">
          Không lưu được
        </span>
      )}
      <Switch
        checked={reminder.isActive}
        disabled={busy}
        onCheckedChange={toggle}
        aria-label={`${reminder.isActive ? "Tắt" : "Bật"} nhắc nhở ${reminder.title}`}
      />
    </div>
  );
}
