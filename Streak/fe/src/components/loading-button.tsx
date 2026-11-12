import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/loading";

// Nút có trạng thái đang xử lý: hiện vòng xoay trước chữ, tự khoá để không bấm đúp, báo aria-busy cho trình đọc màn hình.
export function LoadingButton({ loading = false, disabled, children, ...props }: { loading?: boolean } & ComponentProps<typeof Button>) {
  return (
    <Button disabled={loading || disabled} aria-busy={loading} {...props}>
      {loading && <LoadingSpinner />}
      {children}
    </Button>
  );
}
