import { useState, type FormEvent } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LoadingButton } from "@/components/loading-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ApiError } from "@/lib/api-client";
import { createReminder, updateReminder } from "../api/reminders";
import { WEEK_DAYS } from "../lib/days";
import type { Reminder } from "../types";

// Múi giờ của trình duyệt (IANA, ví dụ "Asia/Ho_Chi_Minh"): giờ nhắc luôn hiểu theo giờ địa phương của người dùng.
const browserTimeZoneId = Intl.DateTimeFormat().resolvedOptions().timeZone;

// Không truyền `editing` = tạo mới; có `editing` = sửa nhắc nhở đó (cha nên gắn key={editing.id} để form khởi tạo lại).
export function ReminderForm({
  editing,
  onSaved,
  onCancel,
}: {
  editing?: Reminder;
  onSaved: (reminder: Reminder) => void;
  onCancel?: () => void;
}) {
  const [title, setTitle] = useState(editing?.title ?? "");
  const [time, setTime] = useState(editing ? editing.timeOfDay.slice(0, 5) : "05:00");
  const [days, setDays] = useState<string[]>(editing ? editing.days.map(String) : ["1", "2", "3", "4", "5"]);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  // Sửa thì giữ múi giờ cũ của nhắc nhở (giờ nhắc đã được hiểu theo múi giờ đó); tạo mới thì lấy múi giờ trình duyệt.
  const timeZoneId = editing?.timeZoneId ?? browserTimeZoneId;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) return setNotice("Hãy đặt tên cho nhắc nhở.");
    if (!time) return setNotice("Hãy chọn giờ nhắc.");
    if (days.length === 0) return setNotice("Hãy chọn ít nhất một ngày trong tuần.");

    setBusy(true);
    setNotice(null);
    const input = { title: title.trim(), timeOfDay: `${time}:00`, timeZoneId, days: days.map(Number) };
    try {
      const saved = editing
        ? await updateReminder(editing.id, { ...input, isActive: editing.isActive })
        : await createReminder(input);
      onSaved(saved);
      if (!editing) setTitle("");
    } catch (err) {
      setNotice(
        err instanceof ApiError && err.status === 401
          ? "Phiên đăng nhập đã hết hạn. Hãy đăng nhập lại."
          : err instanceof ApiError && err.status === 404
            ? "Nhắc nhở này không còn tồn tại."
            : editing
              ? "Không lưu được thay đổi, hãy thử lại sau."
              : "Không tạo được nhắc nhở, hãy thử lại sau.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 px-6 py-6">
      <div className="flex flex-col gap-2">
        <Label htmlFor="reminder-title">Việc cần nhắc</Label>
        <Input
          id="reminder-title"
          value={title}
          maxLength={200}
          placeholder="Ví dụ: Dậy sớm"
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="reminder-time">Giờ nhắc</Label>
        <Input id="reminder-time" type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-36" />
        <p className="text-xs text-muted-foreground">Theo múi giờ {timeZoneId}</p>
      </div>

      <div className="flex flex-col gap-2">
        <Label id="reminder-days">Lặp lại vào</Label>
        <ToggleGroup
          type="multiple"
          variant="outline"
          spacing={1}
          value={days}
          onValueChange={setDays}
          aria-labelledby="reminder-days"
          className="flex-wrap"
        >
          {WEEK_DAYS.map((d) => (
            <ToggleGroupItem
              key={d.value}
              value={String(d.value)}
              aria-label={d.label}
              className="data-[state=on]:border-calendar-red data-[state=on]:bg-calendar-red data-[state=on]:text-white"
            >
              {d.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      {notice && (
        <Alert className="notice-enter rounded-xl border-warning/30 bg-warning-bg">
          <AlertDescription className="text-warning">{notice}</AlertDescription>
        </Alert>
      )}

      <div className="flex items-center gap-3">
        <LoadingButton type="submit" loading={busy} className="press h-11 rounded-full px-6 font-semibold">
          {busy ? "Đang lưu..." : editing ? "Lưu thay đổi" : "Tạo nhắc nhở"}
        </LoadingButton>
        {editing && (
          <Button type="button" variant="ghost" onClick={onCancel} disabled={busy} className="h-11 rounded-full px-5">
            Huỷ
          </Button>
        )}
      </div>
    </form>
  );
}
