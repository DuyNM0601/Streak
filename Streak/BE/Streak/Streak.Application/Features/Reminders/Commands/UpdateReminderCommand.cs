using Streak.Application.Features.Reminders.Models;
using Streak.Application.Shared;

namespace Streak.Application.Features.Reminders.Commands
{
    /// <summary>Id lấy từ đường dẫn (endpoint ghi đè bằng `with`), không tin giá trị trong body.</summary>
    public sealed record UpdateReminderCommand(string Id, string Title, TimeOnly TimeOfDay, string TimeZoneId, DayOfWeek[] Days, bool IsActive)
        : ICommand<ReminderModel>;
}
