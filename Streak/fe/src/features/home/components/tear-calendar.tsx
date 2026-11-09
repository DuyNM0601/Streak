import { useEffect, useRef, useState } from "react";
import { CalendarSheet } from "@/components/calendar-sheet";
import { PenCircle } from "@/components/pen-marks";
import { Button } from "@/components/ui/button";
import { WEEKDAYS, addDays, monthBand, sampleStreak } from "../lib/calendar";

const reminders = [
  { time: "05:00", title: "Thông báo web", note: "Đúng giờ", red: false, circled: false },
  { time: "05:05", title: "Gửi email", note: "+5 phút", red: true, circled: false },
  { time: "05:10", title: "Gọi điện thoại", note: "+10 phút", red: true, circled: true },
];

// Nội dung của một tờ: ngày, ba mốc nhắc, chân tờ. Dùng cho cả tờ trên cùng lẫn tờ nằm dưới để lúc xé
// xong, tờ dưới lộ ra đã đầy đủ như tờ thật (không bị "bật" thêm nội dung).
function SheetContent({
  date,
  streak,
  onTear,
  tearing,
}: {
  date: Date;
  streak: number;
  onTear: () => void;
  tearing: boolean;
}) {
  const isSunday = date.getDay() === 0;
  return (
    <>
      <div className="px-6 pt-5 text-center lg:pt-7">
        <div
          className={`numeral text-[clamp(6rem,15vw,9rem)] lg:text-[clamp(8rem,11vw,11rem)] ${isSunday ? "text-calendar-red" : "text-ink"}`}
        >
          {String(date.getDate()).padStart(2, "0")}
        </div>
        <div className="mt-2 text-sm font-extrabold tracking-[0.18em] uppercase lg:text-base">
          {WEEKDAYS[date.getDay()]}
        </div>
      </div>

      <ol className="mx-6 mt-6 divide-y divide-border" aria-label="Nhắc nhở mẫu: Dậy sớm">
        {reminders.map((r) => (
          <li key={r.time} className="flex items-center gap-4 py-2.5 lg:py-3.5">
            <span className="relative">
              <span className={`numeral text-3xl lg:text-4xl ${r.red ? "text-calendar-red" : "text-ink"}`}>{r.time}</span>
              {r.circled && <PenCircle delay={600} />}
            </span>
            <span className="flex flex-1 items-baseline justify-between gap-2">
              <span className="text-sm font-semibold lg:text-base">{r.title}</span>
              <span className="text-xs text-muted-foreground lg:text-sm">{r.note}</span>
            </span>
          </li>
        ))}
      </ol>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-border px-6 py-4">
        <span className="text-xs text-muted-foreground">Nhắc nhở mẫu · chuỗi minh hoạ: {streak} ngày</span>
        <Button
          type="button"
          onClick={onTear}
          disabled={tearing}
          variant="outline"
          className="h-10 rounded-full border-ink/35 bg-transparent px-5 text-sm font-semibold text-ink hover:bg-ink/8 hover:text-ink dark:border-ink/35 dark:bg-transparent dark:hover:bg-ink/8"
        >
          Xé tờ hôm nay
        </Button>
      </div>
    </>
  );
}

// Tờ lịch hôm nay ở hero, nằm trên một chồng tờ. Bấm "Xé tờ" thì tờ trên cùng rơi, tờ kế (cùng vị trí,
// cùng nội dung) lộ ra nên lúc đổi ngày không có bước nhảy hình. Chuỗi ở đây chỉ để minh hoạ.
export function TearCalendar() {
  const [today] = useState(() => new Date());
  const [offset, setOffset] = useState(0);
  const [tearing, setTearing] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  function tear() {
    if (tearing) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setOffset((o) => o + 1);
      return;
    }
    setTearing(true);
    timer.current = window.setTimeout(() => {
      setOffset((o) => o + 1);
      setTearing(false);
    }, 700);
  }

  const baseStreak = sampleStreak(today.getDate());
  const date = addDays(today, offset);
  const next = addDays(today, offset + 1);

  return (
    <div className="relative mx-auto w-full max-w-md rotate-[-2deg] lg:max-w-none">
      {/* Mép của các tờ nằm sâu hơn trong chồng lịch. */}
      <div aria-hidden="true" className="paper absolute inset-0 translate-x-1 translate-y-4 rotate-[1.6deg] rounded-[0.35rem]" />
      <div aria-hidden="true" className="paper absolute inset-0 -translate-x-1 translate-y-2 rotate-[-1deg] rounded-[0.35rem]" />

      {/* Tờ nằm ngay dưới: cùng vị trí, ngày kế tiếp, không tương tác. */}
      <CalendarSheet band={monthBand(next)} aria-hidden="true" inert className="absolute inset-0 h-full">
        <SheetContent date={next} streak={baseStreak + offset + 1} onTear={tear} tearing />
      </CalendarSheet>

      <CalendarSheet band={monthBand(date)} className="sheet-leaf relative" data-tearing={tearing || undefined}>
        <SheetContent date={date} streak={baseStreak + offset} onTear={tear} tearing={tearing} />
      </CalendarSheet>

      <span className="sr-only" aria-live="polite">
        Hôm nay là {WEEKDAYS[date.getDay()]}, ngày {date.getDate()} tháng {date.getMonth() + 1}.
      </span>
    </div>
  );
}
