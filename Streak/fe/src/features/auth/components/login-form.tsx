import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { googleClientId } from "@/config/env";
import { ApiError } from "@/lib/api-client";
import { googleLogin } from "../api/google-login";
import { useAuth } from "./auth-provider";

export function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const { signIn } = useAuth();
  const [notice, setNotice] = useState<string | null>(null);

  async function handleCredential(idToken?: string) {
    if (!idToken) {
      setNotice("Google không trả về thông tin đăng nhập. Hãy thử lại.");
      return;
    }
    try {
      signIn(await googleLogin(idToken));
      onSuccess();
    } catch (e) {
      setNotice(
        e instanceof ApiError && e.status === 401
          ? "Tài khoản Google không hợp lệ hoặc đã bị xoá."
          : "Không đăng nhập được, máy chủ đang gặp lỗi. Hãy thử lại sau.",
      );
    }
  }

  return (
    <div className="mt-6 flex flex-col items-start gap-4">
      {googleClientId ? (
        <GoogleLogin
          onSuccess={(res) => handleCredential(res.credential)}
          onError={() => setNotice("Đăng nhập Google thất bại. Hãy thử lại.")}
          shape="pill"
          size="large"
          width="300"
        />
      ) : (
        <p className="text-sm text-muted-foreground">Chưa cấu hình VITE_GOOGLE_CLIENT_ID trong .env.local.</p>
      )}

      {notice && (
        <Alert className="notice-enter rounded-xl border-warning/30 bg-warning-bg">
          <AlertDescription className="text-warning">{notice}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
