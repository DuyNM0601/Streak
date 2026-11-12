using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Streak.Application.Common;
using Streak.Application.Shared;
using Streak.Domain.Entities;

namespace Streak.Application.Features.Reminders.Commands
{
    public sealed class DeleteReminderCommandHandler(
        IAppDbContext db,
        ICurrentUser currentUser,
        ILogger<DeleteReminderCommandHandler> logger)
        : CommandHandler<DeleteReminderCommand, Unit>(logger)
    {
        public override async Task<Result<Unit>> HandleAsync(DeleteReminderCommand command, CancellationToken ct)
        {
            if (currentUser.UserId is not { } userId)
                return Fail(Error.Unauthorized("You must be signed in."));

            Reminder? reminder = await db.Reminders
                .FirstOrDefaultAsync(x => x.Id == command.Id && x.UserId == userId && x.DeletedAt == null, ct);
            if (reminder is null)
                return Fail(Error.NotFound("Reminder not found."));

            reminder.DeletedAt = DateTimeOffset.UtcNow;
            reminder.DeletedBy = userId;
            await db.SaveChangesAsync(ct);

            return Ok(Unit.Value);
        }
    }
}
