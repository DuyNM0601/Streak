import type { CSSProperties } from "react";
import { useAuthModal } from "@/features/auth";
import { CalendarSheet } from "@/components/calendar-sheet";
import { Reveal } from "@/components/reveal";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

const steps = [
  {
    title: "Tạo nhắc nhở",
    desc: "Đặt tên việc cần làm, chọn giờ và những ngày trong tuần cần lặp lại, ví dụ \"Dậy sớm\" lúc 05:30, Thứ Hai đến Thứ Bảy.",
  },
  {
    title: "Chọn kênh leo thang",
    desc: "Bật Thông báo web, Email, Gọi điện cho từng nhắc nhở. Mỗi kênh đặt thời gian chờ riêng (ví dụ Email sau 5 phút, Gọi điện sau 10 phút) tính từ giờ nhắc.",
  },
  {
    title: "Xác nhận đúng giờ",
    desc: "Khi thông báo tới, bấm \"Tôi dậy rồi\" trên web, bấm nút trong email, hoặc bấm phím 1 khi nghe điện thoại. Xác nhận ở bước nào thì các bước leo thang sau tự huỷ.",
  },
  {
    title: "Theo dõi chuỗi ngày",
    desc: "Mục Thống kê cho biết chuỗi ngày liên tục hiện tại, kỷ lục cũ, và bạn thường phản hồi ở kênh nào — để điều chỉnh thời gian chờ cho hợp.",
  },
];

const tilts = ["-1.2deg", "0.8deg", "0.6deg", "-0.9deg"];
// Độ rộng và độ lệch khác nhau để bốn tờ không thành lưới thẻ đều nhau.
const layout = ["md:col-span-3", "md:col-span-2 md:mt-10", "md:col-span-2", "md:col-span-3 md:mt-8"];

const faqs = [
  {
    q: "Streak gọi điện tới số nào?",
    a: "Số điện thoại bạn xác minh lúc tạo tài khoản. Bạn xác minh lại bất cứ lúc nào trong phần cài đặt.",
  },
  {
    q: "Tôi có thể hoãn nhắc nhở không?",
    a: "Được, mỗi nhắc nhở cho hoãn tối đa một số lần cố định, mỗi lần vài phút. Hoãn hết số lần thì nhắc nhở tiếp tục leo thang như bình thường.",
  },
  {
    q: "Nếu tôi không nghe máy thì sao?",
    a: "Cuộc gọi không được nghe sẽ được ghi nhận là chưa xác nhận. Tuỳ cấu hình, Streak có thể gọi lại sau vài phút.",
  },
];

export function GuidePage() {
  const { open } = useAuthModal();

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-16">
      <h1 className="hero-in font-display text-4xl font-extrabold tracking-tight">Hướng dẫn sử dụng</h1>
      <p className="hero-in mt-3 max-w-lg text-muted-foreground" style={{ transitionDelay: "60ms" }}>
        Bốn bước để Streak thật sự giữ bạn đúng giờ.
      </p>

      <ol className="mt-12 grid gap-8 md:grid-cols-5">
        {steps.map((step, i) => (
          <li key={step.title} className={layout[i]}>
            <Reveal immediate delay={i * 80}>
              <CalendarSheet
                band="Streak"
                className="rotate-[var(--tilt)]"
                style={{ "--tilt": tilts[i] } as CSSProperties}
                bodyClassName="flex gap-5 px-6 pb-6 pt-5"
              >
                <span className={`numeral text-6xl ${i === 2 ? "text-calendar-red" : "text-ink"}`}>{i + 1}</span>
                <div>
                  <h2 className="font-display text-lg font-bold">{step.title}</h2>
                  <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{step.desc}</p>
                </div>
              </CalendarSheet>
            </Reveal>
          </li>
        ))}
      </ol>

      <Reveal immediate variant="rise">
        <h2 className="mt-16 font-display text-2xl font-extrabold tracking-tight">Câu hỏi thường gặp</h2>
      </Reveal>
      <Accordion type="single" collapsible className="mt-6 max-w-2xl space-y-4">
        {faqs.map((item, i) => (
          <Reveal immediate key={item.q} variant="rise" delay={i * 60}>
            <AccordionItem value={item.q} className="paper rounded-md border-0 px-5">
              <AccordionTrigger className="font-semibold hover:no-underline">{item.q}</AccordionTrigger>
              <AccordionContent className="text-sm leading-6 text-muted-foreground">{item.a}</AccordionContent>
            </AccordionItem>
          </Reveal>
        ))}
      </Accordion>

      <Reveal immediate variant="rise">
        <div className="mt-12">
          <Button type="button" onClick={open} className="h-12 rounded-full px-7 text-sm font-semibold">
            Tạo nhắc nhở đầu tiên
          </Button>
        </div>
      </Reveal>
    </div>
  );
}
