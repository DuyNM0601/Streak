import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuthModal } from "@/features/auth";
import { Reveal } from "@/components/reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Màu tăng dần theo mức leo thang: web (nhẹ) → email (cảnh báo) → gọi điện (nghiêm trọng nhất).
const escalationSteps = [
  {
    time: "Đúng giờ",
    title: "Thông báo web",
    desc: "Cửa sổ nhắc và âm báo ngay trên trình duyệt.",
    label: "text-accent-foreground",
    dot: "bg-primary",
  },
  {
    time: "+5 phút",
    title: "Gửi email",
    desc: "Kèm nút xác nhận một chạm, không cần mở app.",
    label: "text-warning",
    dot: "bg-warning",
  },
  {
    time: "+10 phút",
    title: "Gọi điện thoại",
    desc: "Giọng đọc tự động, bấm phím 1 để xác nhận.",
    label: "text-danger",
    dot: "bg-danger",
  },
];

const stats = [
  { label: "Chuỗi ngày liên tục", value: "23", note: "Kỷ lục: 41 ngày" },
  { label: "Hoàn thành tuần này", value: "86%", note: "18 / 21 nhắc nhở" },
  { label: "Cuộc gọi đã cần", value: "2", note: "Tuần trước: 5 cuộc" },
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
      {/* Hero */}
      <section className="snap-section border-b border-border bg-card">
        <div className="mx-auto max-w-5xl px-6 py-20 text-center">
          <Badge
            variant="outline"
            className="hero-in gap-2 bg-background px-4 py-1.5 text-sm font-medium text-accent-foreground"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Nhắc nhở nghiêm túc, không để bạn lờ đi
          </Badge>
          <h1
            className="hero-in mx-auto mt-6 max-w-2xl font-display text-4xl font-bold tracking-tight sm:text-5xl"
            style={{ transitionDelay: "60ms" }}
          >
            Nếu bạn không xác nhận, chuông vẫn reo.
          </h1>
          <p
            className="hero-in mx-auto mt-4 max-w-xl text-lg text-muted-foreground"
            style={{ transitionDelay: "120ms" }}
          >
            Streak nhắc bạn đúng giờ cho việc dậy sớm, học bài, làm việc. Không xác nhận thì
            Streak leo thang: web, rồi email, rồi gọi điện thật.
          </p>
          <div
            className="hero-in mt-8 flex flex-wrap items-center justify-center gap-3"
            style={{ transitionDelay: "180ms" }}
          >
            <Button type="button" onClick={open} className="h-12 rounded-full px-7 text-sm font-semibold">
              Bắt đầu giữ chuỗi ngày
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-12 rounded-full border-border px-7 text-sm font-semibold hover:border-primary"
            >
              <Link to="/guide">Xem cách dùng</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Escalation */}
      <section className="snap-section mx-auto max-w-5xl px-6 py-20">
        <Reveal variant="section">
          <div className="stagger-fade">
            <h2 className="text-center font-display text-2xl font-bold">Leo thang đúng 3 bước</h2>
            <p className="mx-auto mt-2 max-w-md text-center text-sm text-muted-foreground">
              Mỗi nhắc nhở có thể bật cả 3 kênh. Kênh sau chỉ kích hoạt khi bạn vẫn chưa xác nhận.
            </p>
          </div>
          <ol className="mt-10 grid gap-6 sm:grid-cols-3">
            {escalationSteps.map((step, i) => (
              <li key={step.title}>
                <div className="stagger-fade" style={{ transitionDelay: `${i * 80}ms` }}>
                  <div className="card-hover rounded-2xl border border-border bg-card p-6 hover:border-primary/40">
                    <span className={`inline-flex items-center gap-2 font-display text-sm font-bold ${step.label}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${step.dot}`} />
                      Bước {i + 1} · {step.time}
                    </span>
                    <h3 className="mt-3 text-lg font-semibold">{step.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{step.desc}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>
      </section>

      {/* Stats teaser */}
      <section className="snap-section border-y border-border bg-card">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <Reveal variant="section">
            <div className="stagger-fade">
              <h2 className="text-center font-display text-2xl font-bold">Theo dõi chuỗi ngày của bạn</h2>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {stats.map((s, i) => (
                <div key={s.label} className="stagger-fade" style={{ transitionDelay: `${i * 80}ms` }}>
                  <div className="card-hover rounded-2xl border border-border bg-background p-6 hover:border-primary/40">
                    <span className="text-sm text-muted-foreground">{s.label}</span>
                    <div className="mt-1 font-display text-4xl font-bold text-primary">{s.value}</div>
                    <span className="text-xs text-muted-foreground">{s.note}</span>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="snap-section mx-auto max-w-5xl px-6 py-20 text-center">
        <Reveal variant="section">
          <div className="stagger-fade">
            <h2 className="font-display text-2xl font-bold">Sẵn sàng giữ kỷ luật chưa?</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Tạo nhắc nhở đầu tiên trong chưa đầy một phút.
            </p>
            <Button type="button" onClick={open} className="mt-6 h-12 rounded-full px-7 text-sm font-semibold">
              Đăng nhập / Tạo tài khoản
            </Button>
          </div>
        </Reveal>
      </section>
    </>
  );
}
