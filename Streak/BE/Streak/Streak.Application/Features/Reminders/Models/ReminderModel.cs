using Streak.Domain.Entities;

namespace Streak.Application.Features.Reminders.Models
{
    /// <summary>Model trả về client, không lộ Entity. Days là các thứ trong tuần (0 = Chủ nhật ... 6 = Thứ bảy).</summary>
    public class ReminderModel
    {
        public string Id { get; set; } = default!;

        public string Title { get; set; } = default!;

        public TimeOnly TimeOfDay { get; set; }

        public string TimeZoneId { get; set; } = default!;

        public DayOfWeek[] Days { get; set; } = [];

        public bool IsActive { get; set; }

        public DateTimeOffset CreatedAt { get; set; }

        public static ReminderModel From(Reminder reminder) => new()
        {
            Id = reminder.Id,
            Title = reminder.Title,
            TimeOfDay = reminder.TimeOfDay,
            TimeZoneId = reminder.TimeZoneId,
            Days = reminder.Days.ToDays(),
            IsActive = reminder.IsActive,
            CreatedAt = reminder.CreatedAt,
        };
    }
}
