import { Trash2 } from "lucide-react";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { LoadingButton } from "@/components/loading-button";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api-client";
import { deleteReminder } from "../api/reminders";
import type { Reminder } from "../types";

// Hỏi lại trước khi xoá; popup là một tờ lịch cho đồng bộ với popup đăng xuất.
export function DeleteReminderButton({ reminder, onDeleted }: { reminder: Reminder; onDeleted: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setBusy(true);
    setError(null);
    try {
      await deleteReminder(reminder.id);
      setOpen(false);
      onDeleted(reminder.id);
    } catch (e) {
      // 404 = đã bị xoá từ nơi khác: coi như xoá xong.
      if (e instanceof ApiError && e.status === 404) {
        setOpen(false);
        onDeleted(reminder.id);
      } else {
        setError("Không xoá được, hãy thử lại sau.");
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <AlertDialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) setError(null);
      }}
    >
      <AlertDialogTrigger asChild>
        <Button type="button" variant="ghost" size="icon" aria-label={`Xoá nhắc nhở ${reminder.title}`}>
          <Trash2 className="size-4" aria-hidden="true" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="paper gap-0 overflow-hidden rounded-md border-0 p-0 data-[size=default]:sm:max-w-sm">
        <div className="sheet-band">Streak</div>
        <div className="sheet-tear" aria-hidden="true" />
        <div className="px-8 pb-8 pt-6">
          <AlertDialogHeader className="gap-1 text-left">
            <AlertDialogTitle className="font-display text-2xl font-extrabold tracking-tight">Xoá nhắc nhở?</AlertDialogTitle>
            <AlertDialogDescription>
              “{reminder.title}” sẽ không còn nhắc bạn nữa. Việc này không hoàn tác được.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {error && <p className="mt-3 text-sm text-warning">{error}</p>}
          <AlertDialogFooter className="mt-6">
            <AlertDialogCancel disabled={busy}>Ở lại</AlertDialogCancel>
            {/* Không dùng AlertDialogAction: nó tự đóng hộp ngay, mà ta chỉ đóng khi BE xoá xong. */}
            <LoadingButton type="button" onClick={handleDelete} loading={busy}>
              {busy ? "Đang xoá..." : "Xoá"}
            </LoadingButton>
          </AlertDialogFooter>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
