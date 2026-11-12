import { authedRequest } from "@/features/auth";
import type { CreateReminderInput, Reminder, UpdateReminderInput } from "../types";

export function listReminders() {
  return authedRequest<Reminder[]>("/reminders");
}

export function createReminder(input: CreateReminderInput) {
  return authedRequest<Reminder>("/reminders", { method: "POST", body: JSON.stringify(input) });
}

export function updateReminder(id: string, input: UpdateReminderInput) {
  return authedRequest<Reminder>(`/reminders/${id}`, { method: "PUT", body: JSON.stringify(input) });
}

export function deleteReminder(id: string) {
  return authedRequest<void>(`/reminders/${id}`, { method: "DELETE" });
}
