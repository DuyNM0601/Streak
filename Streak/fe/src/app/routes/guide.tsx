import { useAuthModal } from "@/features/auth";
import { Reveal } from "@/components/reveal";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

const steps = [
  {
    title: "1. Tạo nhắc nhở",
    desc: "Đặt tên việc cần làm, chọn giờ và những ngày trong tuần cần lặp lại, ví dụ \"Dậy sớm\" lúc 05:30, Thứ Hai đến Thứ Bảy.",
  },
  {
    title: "2. Chọn kênh leo thang",
    desc: "Bật Thông báo web, Email, Gọi điện cho từng nhắc nhở. Mỗi kênh đặt thời gian chờ riêng (ví dụ Email sau 5 phút, Gọi điện sau 10 phút) tính từ giờ nhắc.",
  },
  {
    title: "3. Xác nhận đúng giờ",
    desc: "Khi thông báo tới, bấm \"Tôi dậy rồi\" trên web, bấm nút trong email, hoặc bấm phím 1 khi nghe điện thoại. Xác nhận ở bước nào thì các bước leo thang sau tự huỷ.",
  },
  {
    title: "4. Theo dõi chuỗi ngày",
    desc: "Mục Thống kê cho biết chuỗi ngày liên tục hiện tại, kỷ lục cũ, và bạn thường phản hồi ở kênh nào — để điều chỉnh thời gian chờ cho hợp.",
  },
];

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
    <div className="mx-auto w-full max-w-3xl px-6 py-16">
      <h1 className="hero-in font-display text-3xl font-bold">Hướng dẫn sử dụng</h1>
      <p className="hero-in mt-2 text-muted-foreground" style={{ transitionDelay: "60ms" }}>
        Bốn bước để Streak thật sự giữ bạn đúng giờ.
      </p>

      <ol className="mt-10 space-y-6">
        {steps.map((step, i) => (
          <li key={step.title}>
            <Reveal immediate delay={i * 60}>
              <div className="card-hover rounded-2xl border border-border bg-card p-6 hover:border-primary/40">
                <h2 className="font-display text-lg font-semibold">{step.title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.desc}</p>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>

      <Reveal immediate variant="rise">
        <h2 className="mt-14 font-display text-2xl font-bold">Câu hỏi thường gặp</h2>
      </Reveal>
      <Accordion type="single" collapsible className="mt-6 space-y-4">
        {faqs.map((item, i) => (
          <Reveal immediate key={item.q} variant="rise" delay={i * 60}>
            <AccordionItem value={item.q} className="card-hover rounded-2xl border border-border bg-card px-5 hover:border-primary/40">
              <AccordionTrigger className="font-semibold hover:no-underline">{item.q}</AccordionTrigger>
              <AccordionContent className="text-sm leading-6 text-muted-foreground">{item.a}</AccordionContent>
            </AccordionItem>
          </Reveal>
        ))}
      </Accordion>

      <Reveal immediate variant="rise">
        <div className="mt-12 flex justify-center">
          <Button type="button" onClick={open} className="h-12 rounded-full px-7 text-sm font-semibold">
            Tạo nhắc nhở đầu tiên
          </Button>
        </div>
      </Reveal>
    </div>
  );
}
