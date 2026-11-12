import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { describeDays } from "../lib/days";
import type { Reminder } from "../types";
import { ActiveSwitch } from "./active-switch";
import { DeleteReminderButton } from "./delete-reminder-button";

export function ReminderList({
  reminders,
  editingId,
  onEdit,
  onChanged,
  onDeleted,
}: {
  reminders: Reminder[];
  editingId?: string;
  onEdit: (reminder: Reminder) => void;
  onChanged: (reminder: Reminder) => void;
  onDeleted: (id: string) => void;
}) {
  if (reminders.length === 0) {
    return <p className="px-6 py-8 text-sm text-muted-foreground">Chưa có nhắc nhở nào. Hãy tạo nhắc nhở đầu tiên.</p>;
  }

  return (
    <ul className="divide-y divide-border">
      {reminders.map((r) => (
        <li key={r.id} className={`flex items-center gap-4 px-6 py-4 ${r.id === editingId ? "bg-foreground/5" : ""}`}>
          {/* Nhắc nhở đang tắt thì mờ đi phần chữ, còn các nút vẫn rõ để bật lại. */}
          <div className={`flex min-w-0 flex-1 items-center gap-5 transition-opacity ${r.isActive ? "" : "opacity-50"}`}>
            <span className="numeral text-4xl leading-none">{r.timeOfDay.slice(0, 5)}</span>
            <div className="min-w-0">
              <p className="truncate font-semibold">{r.title}</p>
              <p className="text-sm text-muted-foreground">{r.isActive ? describeDays(r.days) : `Đang tắt · ${describeDays(r.days)}`}</p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <ActiveSwitch reminder={r} onChanged={onChanged} />
            <Button type="button" variant="ghost" size="icon" aria-label={`Sửa nhắc nhở ${r.title}`} onClick={() => onEdit(r)}>
              <Pencil className="size-4" aria-hidden="true" />
            </Button>
            <DeleteReminderButton reminder={r} onDeleted={onDeleted} />
          </div>
        </li>
      ))}
    </ul>
  );
}
