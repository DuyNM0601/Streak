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
        {/* Popup là một tờ lịch: dải đỏ có lỗ treo, đường xé, rồi thân giấy. */}
        <DialogContent className="paper max-w-sm gap-0 overflow-hidden rounded-md border-0 p-0 [&>button]:text-white [&>button]:opacity-90">
          <div className="sheet-band">Streak</div>
          <div className="sheet-tear" aria-hidden="true" />
          <div className="px-8 pb-8 pt-6">
            <DialogHeader className="gap-1 text-left">
              <DialogTitle className="font-display text-2xl font-extrabold tracking-tight">Đăng nhập</DialogTitle>
              <DialogDescription>Đăng nhập để tạo và quản lý nhắc nhở của bạn.</DialogDescription>
            </DialogHeader>
            <LoginForm key={session} onSuccess={() => setIsOpen(false)} />
          </div>
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
