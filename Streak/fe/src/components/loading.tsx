import type { ComponentProps } from "react";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

// Vòng xoay dùng chung. Người dùng bật "giảm chuyển động" thì xoay chậm lại thay vì đứng yên, để vẫn nhận ra đang tải.
export function LoadingSpinner({ className, ...props }: ComponentProps<typeof Spinner>) {
  return <Spinner aria-hidden="true" role={undefined} className={cn("motion-reduce:animate-[spin_3s_linear_infinite]", className)} {...props} />;
}
