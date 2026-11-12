using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Streak.Application.Common;
using Streak.Application.Features.Reminders.Models;
using Streak.Application.Shared;
using Streak.Domain.Entities;

namespace Streak.Application.Features.Reminders.Commands
{
    public sealed class UpdateReminderCommandHandler(
        IAppDbContext db,
        ICurrentUser currentUser,
        ILogger<UpdateReminderCommandHandler> logger)
        : CommandHandler<UpdateReminderCommand, ReminderModel>(logger)
    {
        public override async Task<Result<ReminderModel>> HandleAsync(UpdateReminderCommand command, CancellationToken ct)
        {
            if (currentUser.UserId is not { } userId)
                return Fail(Error.Unauthorized("You must be signed in."));

            if (ReminderRules.Validate(command.Title, command.Days, command.TimeZoneId) is { } invalid)
                return Fail(invalid);

            // Lọc theo UserId: nhắc nhở của người khác trả 404 y như không tồn tại, không lộ là có.
            Reminder? reminder = await db.Reminders
                .FirstOrDefaultAsync(x => x.Id == command.Id && x.UserId == userId && x.DeletedAt == null, ct);
            if (reminder is null)
                return Fail(Error.NotFound("Reminder not found."));

            reminder.Title = command.Title.Trim();
            reminder.TimeOfDay = command.TimeOfDay;
            reminder.TimeZoneId = command.TimeZoneId;
            reminder.Days = WeekdaysExtensions.From(command.Days);
            reminder.IsActive = command.IsActive;
            reminder.UpdatedAt = DateTimeOffset.UtcNow;
            reminder.UpdatedBy = userId;
            await db.SaveChangesAsync(ct);

            return Ok(ReminderModel.From(reminder));
        }
    }
}
