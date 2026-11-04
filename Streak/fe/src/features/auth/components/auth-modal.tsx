import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LoginForm } from "./login-form";

const AuthModalContext = createContext<{ open: () => void } | null>(null);

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [session, setSession] = useState(0);

  const open = useCallback(() => {
    setSession((s) => s + 1); // form mới mỗi lần mở → xoá thông báo của lần trước
    setIsOpen(true);
  }, []);

  return (
    <AuthModalContext.Provider value={{ open }}>
      {children}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-sm rounded-2xl p-8">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="13" r="8" />
              <path d="M12 9v4l2.5 2M9 2.5h6" />
            </svg>
          </span>
          <DialogHeader className="gap-1">
            <DialogTitle className="font-display text-2xl font-bold">Đăng nhập</DialogTitle>
            <DialogDescription>Đăng nhập để tạo và quản lý nhắc nhở của bạn.</DialogDescription>
          </DialogHeader>
          <LoginForm key={session} />
        </DialogContent>
      </Dialog>
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const ctx = useContext(AuthModalContext);
  if (!ctx) throw new Error("useAuthModal phải dùng trong AuthModalProvider");
  return ctx;
}
