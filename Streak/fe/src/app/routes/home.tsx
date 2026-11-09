import { useEffect, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import { useAuthModal } from "@/features/auth";
import { MonthSheet, TearCalendar } from "@/features/home";
import { CalendarSheet } from "@/components/calendar-sheet";
import { PenCircle, PenUnderline } from "@/components/pen-marks";
import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";

// Mức leo thang tăng dần: số giờ to dần, đổi từ mực đen sang đỏ, bước cuối bị khoanh bút đỏ.
const escalationSteps = [
  {
    time: "05:00",
    tag: "Đúng giờ",
    title: "Thông báo web",
    desc: "Cửa sổ nhắc và âm báo ngay trên trình duyệt.",
    size: "3.75rem",
    red: false,
    circled: false,
    tilt: "-1.5deg",
  },
  {
    time: "05:05",
    tag: "+5 phút",
    title: "Gửi email",
    desc: "Kèm nút xác nhận một chạm, không cần mở app.",
    size: "4.75rem",
    red: true,
    circled: false,
    tilt: "1deg",
  },
  {
    time: "05:10",
    tag: "+10 phút",
    title: "Gọi điện thoại",
    desc: "Giọng đọc tự động, bấm phím 1 để xác nhận.",
    size: "6rem",
    red: true,
    circled: true,
    tilt: "-1deg",
  },
];

export function HomePage() {
  const { open } = useAuthModal();

  // Trang dạng slide (scroll-snap) chỉ bật khi đang ở Home - xem .snap-page ở index.css. Rời trang
  // (chuyển route) thì gỡ ra ngay, không ảnh hưởng cuộn bình thường của Guide hay trang khác.
  useEffect(() => {
    document.documentElement.classList.add("snap-page");
    return () => document.documentElement.classList.remove("snap-page");
  }, []);

  return (
    <>
      {/* Hero: tiêu đề trên tường, tờ lịch hôm nay bên cạnh */}
      <section className="snap-section">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-6 py-12 lg:grid-cols-[minmax(0,4fr)_minmax(0,6fr)] lg:gap-16">
          <div>
            <h1
              className="hero-in max-w-xl font-display text-4xl font-extrabold leading-[1.1] tracking-tight text-balance sm:text-5xl"
            >
              Nếu bạn không xác nhận,{" "}
              <span className="relative inline-block">
                chuông vẫn reo.
                <PenUnderline className="text-primary" delay={700} />
              </span>
            </h1>
            <p
              className="hero-in mt-6 max-w-lg text-lg leading-7 text-muted-foreground"
              style={{ transitionDelay: "80ms" }}
            >
              Streak nhắc bạn đúng giờ cho việc dậy sớm, học bài, làm việc. Không xác nhận thì Streak
              leo thang: web, rồi email, rồi gọi điện thật.
            </p>
            <div
              className="hero-in mt-8 flex flex-wrap items-center gap-3"
              style={{ transitionDelay: "160ms" }}
            >
              <Button type="button" onClick={open} className="h-12 rounded-full px-7 text-sm font-semibold">
                Bắt đầu giữ chuỗi ngày
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-12 rounded-full border-foreground/35 bg-transparent px-7 text-sm font-semibold text-foreground hover:bg-foreground/10 hover:text-foreground dark:border-foreground/35 dark:bg-transparent dark:hover:bg-foreground/10"
              >
                <Link to="/guide">Xem cách dùng</Link>
              </Button>
            </div>
          </div>

          <div className="hero-in" style={{ transitionDelay: "240ms" }}>
            <TearCalendar />
          </div>
        </div>
      </section>

      {/* Leo thang: ba tờ lịch, số giờ to dần và đỏ dần */}
      <section className="snap-section">
        <Reveal variant="section">
          <div className="mx-auto w-full max-w-6xl px-6 py-16">
            <div className="stagger-fade">
              <h2 className="font-display text-3xl font-extrabold tracking-tight">Leo thang đúng 3 bước</h2>
              <p className="mt-3 max-w-md text-muted-foreground">
                Mỗi nhắc nhở có thể bật cả 3 kênh. Kênh sau chỉ kích hoạt khi bạn vẫn chưa xác nhận.
              </p>
            </div>
            <ol className="mt-12 grid items-end gap-10 md:grid-cols-3 md:gap-6">
              {escalationSteps.map((step, i) => (
                <li
                  key={step.title}
                  className="sheet-drop"
                  style={{ "--tilt": step.tilt, transitionDelay: `${i * 120}ms` } as CSSProperties}
                >
                  <CalendarSheet band={step.tag} bodyClassName="px-6 pb-6 pt-5">
                    <div className="relative inline-block">
                      <span
                        className={`numeral block ${step.red ? "text-calendar-red" : "text-ink"}`}
                        style={{ fontSize: step.size }}
                      >
                        {step.time}
                      </span>
                      {step.circled && <PenCircle delay={700} className="-inset-x-5 -inset-y-3 h-[calc(100%+1.5rem)] w-[calc(100%+2.5rem)]" />}
                    </div>
                    <h3 className="mt-4 text-lg font-bold">Bước {i + 1}: {step.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">{step.desc}</p>
                  </CalendarSheet>
                </li>
              ))}
            </ol>
          </div>
        </Reveal>
      </section>

      {/* Chuỗi ngày: tờ lịch tháng với dấu X bút đỏ (dữ liệu minh hoạ) */}
      <section className="snap-section">
        <Reveal variant="section">
          <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-6 py-16 lg:grid-cols-2 lg:gap-16">
            <div className="stagger-fade">
              <h2 className="font-display text-3xl font-extrabold tracking-tight">Theo dõi chuỗi ngày của bạn</h2>
              <p className="mt-3 max-w-md leading-7 text-muted-foreground">
                Mỗi dấu X đỏ là một ngày bạn đã xác nhận đúng giờ. Ngày bỏ trống là ngày chuông đã phải
                reo to hơn.
              </p>
            </div>
            <div className="stagger-fade" style={{ transitionDelay: "120ms" }}>
              <MonthSheet />
            </div>
          </div>
        </Reveal>
      </section>

      {/* Kêu gọi hành động cuối trang */}
      <section className="snap-section">
        <Reveal variant="section">
          <div className="mx-auto w-full max-w-2xl px-6 py-16">
            <div className="stagger-fade">
              <CalendarSheet band="Tờ đầu tiên" className="rotate-[-1deg]" bodyClassName="px-8 pb-10 pt-8 text-center">
                <h2 className="font-display text-3xl font-extrabold tracking-tight">Sẵn sàng giữ kỷ luật chưa?</h2>
                <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
                  Tạo nhắc nhở đầu tiên trong chưa đầy một phút.
                </p>
                <Button type="button" onClick={open} className="mt-6 h-12 rounded-full px-7 text-sm font-semibold">
                  Đăng nhập / Tạo tài khoản
                </Button>
              </CalendarSheet>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
