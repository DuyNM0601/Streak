import { CalendarSheet } from "@/components/calendar-sheet";
import { PenCircle, PenCross } from "@/components/pen-marks";
import { isSampleDone, monthBand, sampleStreak } from "../lib/calendar";

const HEADERS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

// Tờ lịch cả tháng hiện tại: dấu X đỏ là ngày đã xác nhận, vòng khoanh là hôm nay. Dữ liệu MINH HOẠ.
export function MonthSheet() {
  const now = new Date();
  const today = now.getDate();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const firstWeekday = (new Date(now.getFullYear(), now.getMonth(), 1).getDay() + 6) % 7; // thứ hai = 0
  const streak = sampleStreak(today);

  return (
    <CalendarSheet band={monthBand(now)} className="mx-auto w-full max-w-md rotate-[1deg]" bodyClassName="px-5 pb-5 pt-3">
      <div className="grid grid-cols-7 text-center text-xs font-bold tracking-wider">
        {HEADERS.map((h, i) => (
          <span key={h} className={`py-2 ${i === 6 ? "text-calendar-red" : "text-muted-foreground"}`}>
            {h}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {Array.from({ length: firstWeekday }).map((_, i) => (
          <span key={`blank-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
          const col = (firstWeekday + day - 1) % 7;
          const done = isSampleDone(day, today);
          return (
            <span key={day} className="relative flex aspect-square items-center justify-center">
              <span
                className={`relative text-base font-semibold ${col === 6 ? "text-calendar-red" : "text-ink"}`}
              >
                {day}
                {day === today && <PenCircle delay={900} className="-inset-x-2 -inset-y-1.5 h-[calc(100%+0.75rem)] w-[calc(100%+1rem)]" />}
                {done && <PenCross delay={150 + day * 40} className="-inset-x-1.5 -inset-y-1 h-[calc(100%+0.5rem)] w-[calc(100%+0.75rem)]" />}
              </span>
            </span>
          );
        })}
      </div>
      <p className="mt-4 border-t border-border pt-3 text-xs text-muted-foreground">
        Dữ liệu minh hoạ · Chuỗi hiện tại: {streak} ngày
      </p>
    </CalendarSheet>
  );
}
