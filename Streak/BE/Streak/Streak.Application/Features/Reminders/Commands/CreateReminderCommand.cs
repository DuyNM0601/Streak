using Streak.Application.Features.Reminders.Models;
using Streak.Application.Shared;

namespace Streak.Application.Features.Reminders.Commands
{
    /// <summary>Không có UserId: chủ nhắc nhở luôn là người đang đăng nhập (ICurrentUser).</summary>
    public sealed record CreateReminderCommand(string Title, TimeOnly TimeOfDay, string TimeZoneId, DayOfWeek[] Days)
        : ICommand<ReminderModel>;
}
