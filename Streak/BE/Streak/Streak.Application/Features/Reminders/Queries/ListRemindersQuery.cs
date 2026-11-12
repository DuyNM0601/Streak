using Streak.Application.Features.Reminders.Models;
using Streak.Application.Shared;

namespace Streak.Application.Features.Reminders.Queries
{
    /// <summary>Nhắc nhở của người đang đăng nhập (ICurrentUser), sắp theo giờ trong ngày.</summary>
    public sealed record ListRemindersQuery : IQuery<IReadOnlyList<ReminderModel>>;
}
