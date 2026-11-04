import { useEffect, useRef, useState, type ReactNode } from "react";

const CLASS_BY_VARIANT = {
  wipe: "reveal",
  rise: "reveal-rise",
  section: "reveal-section",
} as const;

// wipe: quét clip-path (cho card). rise: mờ → rõ + nổi lên (cho khối chữ/CTA). section: mờ + trượt
// lên cho cả 1 section (trang dạng slide, xem .snap-page ở index.css).
// Hiện ra khi cuộn tới (IntersectionObserver). 2 lớp dự phòng để không bao giờ bị kẹt ẩn vĩnh viễn
// (lỗi từng gặp): (1) trình duyệt không có IntersectionObserver thì hiện ngay; (2) quá 2s mà chưa
// cuộn tới (lệch ngưỡng, container lạ...) thì tự hiện, không bắt buộc đúng 1 sự kiện cuộn nữa.
export function Reveal({
  children,
  delay = 0,
  variant = "wipe",
  immediate = false,
}: {
  children: ReactNode;
  delay?: number;
  variant?: "wipe" | "rise" | "section";
  // Hiện ngay khi vào trang (vẫn có hiệu ứng + stagger theo delay), không chờ cuộn tới.
  immediate?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (immediate) {
      const frame = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(frame);
    }

    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    // Section chiếm trọn màn hình (scroll-snap) - chờ thấy được phần lớn rồi mới hiện, khớp đúng
    // lúc trang dừng snap, thay vì hiện quá sớm lúc section chỉ vừa ló lên 15% như card nhỏ.
    const threshold = variant === "section" ? 0.4 : 0.15;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el); // chỉ chạy 1 lần, không lặp lại mỗi lần scroll qua
        }
      },
      { threshold },
    );
    observer.observe(el);

    const fallback = setTimeout(() => setVisible(true), 2000);

    return () => {
      observer.disconnect();
      clearTimeout(fallback);
    };
  }, [variant, immediate]);

  // Quan sát div ngoài (không style gì), KHÔNG quan sát div đã bị clip-path/opacity: Chromium tính
  // clip-path của chính target nên .reveal (clip-path che hết) không bao giờ "giao cắt" -> chỉ hiện
  // nhờ dự phòng 2s hoặc khi cuộn (đã gặp ở trang Hướng dẫn).
  return (
    <div ref={ref}>
      <div
        className={CLASS_BY_VARIANT[variant]}
        data-visible={visible || undefined}
        style={{ transitionDelay: `${delay}ms` }}
      >
        {children}
      </div>
    </div>
  );
}
