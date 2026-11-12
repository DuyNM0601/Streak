using MediatR;
using Streak.Application.Shared;

namespace Streak.Application.Features.Reminders.Commands
{
    /// <summary>Xoá mềm nhắc nhở của người đang đăng nhập.</summary>
    public sealed record DeleteReminderCommand(string Id) : ICommand<Unit>;
}
