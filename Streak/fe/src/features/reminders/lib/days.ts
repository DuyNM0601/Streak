// Thứ tự hiển thị Thứ hai → Chủ nhật; giá trị là DayOfWeek của BE (0 = Chủ nhật).
export const WEEK_DAYS = [
  { value: 1, label: "T2" },
  { value: 2, label: "T3" },
  { value: 3, label: "T4" },
  { value: 4, label: "T5" },
  { value: 5, label: "T6" },
  { value: 6, label: "T7" },
  { value: 0, label: "CN" },
] as const;

export function describeDays(days: number[]) {
  if (days.length === 7) return "Mỗi ngày";
  return WEEK_DAYS.filter((d) => days.includes(d.value))
    .map((d) => d.label)
    .join(" · ");
}
