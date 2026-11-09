export const WEEKDAYS = ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"];

export function monthBand(date: Date) {
  return `Tháng ${date.getMonth() + 1} · ${date.getFullYear()}`;
}

export function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

// Dữ liệu MINH HOẠ cho tờ lịch tháng ở Home: các ngày trước hôm nay đều "đã xác nhận" trừ vài ngày bỏ trống
// cố định. Chưa có API nhắc nhở nên đây không phải dữ liệu thật của ai, và UI luôn gắn nhãn "minh hoạ".
export const SAMPLE_MISSED_DAYS = [3, 12, 20];

export function isSampleDone(day: number, today: number) {
  return day < today && !SAMPLE_MISSED_DAYS.includes(day);
}

export function sampleStreak(today: number) {
  let streak = 0;
  for (let day = today - 1; day >= 1 && isSampleDone(day, today); day--) streak++;
  return streak;
}
