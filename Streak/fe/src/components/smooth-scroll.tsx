import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

// Cuộn có quán tính cho cả trang. Khởi tạo 1 lần ở AppProvider, destroy khi unmount.
// Tắt hẳn khi người dùng bật prefers-reduced-motion (cuộn gốc của trình duyệt).
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // exponential ease-out
    });

    let frame = requestAnimationFrame(function raf(time) {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    });

    // Popup mở thì khoá hẳn cuộn trang nền: dừng Lenis + overflow hidden trên <html>. Không chỉ dựa vào
    // thuộc tính data-scroll-locked của Radix mà còn kiểm tra overlay đang có trong DOM cho chắc.
    const root = document.documentElement;
    const syncLock = () => {
      const locked =
        document.body.hasAttribute("data-scroll-locked") ||
        document.querySelector('[data-slot="dialog-overlay"]') !== null;
      if (locked) {
        lenis.stop();
        root.style.overflow = "hidden";
      } else {
        root.style.overflow = "";
        lenis.start();
      }
    };
    const observer = new MutationObserver(syncLock);
    observer.observe(document.body, {
      childList: true,
      attributes: true,
      attributeFilter: ["data-scroll-locked"],
    });
    syncLock();

    return () => {
      observer.disconnect();
      root.style.overflow = "";
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return null;
}
