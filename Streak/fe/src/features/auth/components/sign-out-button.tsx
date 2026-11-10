import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "./auth-provider";

// Hỏi lại trước khi đăng xuất; popup cũng là một tờ lịch cho đồng bộ với popup đăng nhập.
export function SignOutButton() {
  const { signOut } = useAuth();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="h-10 rounded-full border-foreground/35 bg-transparent px-5 text-sm font-semibold text-foreground hover:bg-foreground/10 hover:text-foreground dark:border-foreground/35 dark:bg-transparent dark:hover:bg-foreground/10"
        >
          Đăng xuất
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="paper gap-0 overflow-hidden rounded-md border-0 p-0 data-[size=default]:sm:max-w-sm">
        <div className="sheet-band">Streak</div>
        <div className="sheet-tear" aria-hidden="true" />
        <div className="px-8 pb-8 pt-6">
          <AlertDialogHeader className="gap-1 text-left">
            <AlertDialogTitle className="font-display text-2xl font-extrabold tracking-tight">Đăng xuất?</AlertDialogTitle>
            <AlertDialogDescription>Bạn sẽ cần đăng nhập lại bằng Google để tiếp tục.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6">
            <AlertDialogCancel>Ở lại</AlertDialogCancel>
            <AlertDialogAction onClick={signOut}>Đăng xuất</AlertDialogAction>
          </AlertDialogFooter>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
