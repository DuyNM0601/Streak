import { RemindersPanel } from "@/features/reminders";

export function RemindersPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-16">
      <h1 className="hero-in font-display text-4xl font-extrabold tracking-tight">Nhắc nhở</h1>
      <p className="hero-in mt-3 max-w-lg text-muted-foreground" style={{ transitionDelay: "60ms" }}>
        Đặt việc, giờ và những ngày cần lặp lại. Streak sẽ nhắc đúng giờ.
      </p>
      <div className="mt-10">
        <RemindersPanel />
      </div>
    </div>
  );
}
