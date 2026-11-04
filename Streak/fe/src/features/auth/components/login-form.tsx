import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const [notice, setNotice] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Streak.Api chưa có hệ thống xác thực (xem CLAUDE.md mục 7) - báo rõ, không giả vờ đăng nhập thành công.
    setNotice("Streak chưa nối máy chủ xác thực. Form này chỉ là giao diện.");
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="ban@gmail.com"
          className="h-11 rounded-xl"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="password">Mật khẩu</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="current-password"
          className="h-11 rounded-xl"
        />
        <span className="text-xs text-muted-foreground">Ít nhất 8 ký tự</span>
      </div>

      <Button type="submit" className="mt-2 h-11 rounded-xl text-sm font-semibold">
        Đăng nhập
      </Button>

      {notice && (
        <Alert className="notice-enter rounded-xl border-warning/30 bg-warning-bg">
          <AlertDescription className="text-warning">{notice}</AlertDescription>
        </Alert>
      )}
    </form>
  );
}
