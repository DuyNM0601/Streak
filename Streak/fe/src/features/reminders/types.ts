// Khớp với ReminderModel ở BE. days: 0 = Chủ nhật ... 6 = Thứ bảy; timeOfDay dạng "HH:mm:ss".
export type Reminder = {
  id: string;
  title: string;
  timeOfDay: string;
  timeZoneId: string;
  days: number[];
  isActive: boolean;
  createdAt: string;
};

export type CreateReminderInput = {
  title: string;
  timeOfDay: string;
  timeZoneId: string;
  days: number[];
};

export type UpdateReminderInput = CreateReminderInput & { isActive: boolean };
