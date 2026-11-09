import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

// Một tờ lịch bloc: dải đỏ (có lỗ treo) + đường răng cưa xé + thân giấy. Mọi nội dung "nằm trên giấy"
// dùng component này để thừa hưởng màu giấy/mực (.paper ở index.css) ở cả sáng lẫn tối.
export function CalendarSheet({
  band,
  className,
  bodyClassName,
  children,
  ...props
}: { band: ReactNode; bodyClassName?: string } & ComponentProps<"div">) {
  return (
    <div className={cn("paper overflow-hidden rounded-[0.35rem]", className)} {...props}>
      <div className="sheet-band">{band}</div>
      <div className="sheet-tear" aria-hidden="true" />
      <div className={bodyClassName}>{children}</div>
    </div>
  );
}
