import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

// Nét bút đỏ vẽ tay (SVG tự vẽ, một độ dày nét duy nhất). .pen (index.css) vẽ dần
// bằng clip-path. Mỗi nét nằm đè lên phần tử cha (cha cần `relative`).
const base = "pointer-events-none absolute text-calendar-red";

function Pen({
  className,
  delay,
  viewBox,
  children,
}: {
  className?: string;
  delay?: number;
  viewBox: string;
  children: React.ReactNode;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox={viewBox}
      preserveAspectRatio="none"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      vectorEffect="non-scaling-stroke"
      className={cn(base, "pen", className)}
      style={delay === undefined ? undefined : ({ "--pen-delay": `${delay}ms` } as CSSProperties)}
    >
      {children}
    </svg>
  );
}

// Khoanh tròn quanh một con số hoặc cụm chữ.
export function PenCircle({ className, delay }: { className?: string; delay?: number }) {
  return (
    <Pen viewBox="0 0 120 60" className={cn("-inset-x-3 -inset-y-2 h-[calc(100%+1rem)] w-[calc(100%+1.5rem)]", className)} delay={delay}>
      <path
        className="pen"
        pathLength={1}
        vectorEffect="non-scaling-stroke"
        d="M62 5 C 96 3, 117 17, 113 32 C 109 50, 72 58, 42 55 C 13 51, 3 35, 10 21 C 19 7, 56 1, 94 8"
      />
    </Pen>
  );
}

// Dấu X gạch chéo cho ngày đã xác nhận.
export function PenCross({ className, delay }: { className?: string; delay?: number }) {
  return (
    <Pen viewBox="0 0 40 40" className={cn("inset-2 h-[calc(100%-1rem)] w-[calc(100%-1rem)]", className)} delay={delay}>
      <path vectorEffect="non-scaling-stroke" d="M6 8 C 14 15, 25 25, 34 33" />
      <path vectorEffect="non-scaling-stroke" d="M33 6 C 26 14, 15 26, 7 34" />
    </Pen>
  );
}

// Gạch chân dưới một cụm chữ.
export function PenUnderline({ className, delay }: { className?: string; delay?: number }) {
  return (
    <Pen viewBox="0 0 120 12" className={cn("inset-x-0 -bottom-2 h-3 w-full", className)} delay={delay}>
      <path vectorEffect="non-scaling-stroke" d="M2 8 C 30 2, 70 11, 118 4" />
    </Pen>
  );
}
