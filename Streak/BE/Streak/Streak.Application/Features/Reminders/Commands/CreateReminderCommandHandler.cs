using Microsoft.Extensions.Logging;
using Streak.Application.Common;
using Streak.Application.Features.Reminders.Models;
using Streak.Application.Shared;
using Streak.Domain.Entities;

namespace Streak.Application.Features.Reminders.Commands
{
    public sealed class CreateReminderCommandHandler(
        IAppDbContext db,
        ICurrentUser currentUser,
        ILogger<CreateReminderCommandHandler> logger)
        : CommandHandler<CreateReminderCommand, ReminderModel>(logger)
    {
        public override async Task<Result<ReminderModel>> HandleAsync(CreateReminderCommand command, CancellationToken ct)
        {
            if (currentUser.UserId is not { } userId)
                return Fail(Error.Unauthorized("You must be signed in."));

            if (ReminderRules.Validate(command.Title, command.Days, command.TimeZoneId) is { } invalid)
                return Fail(invalid);

            var reminder = new Reminder
            {
                UserId = userId,
                Title = command.Title.Trim(),
                TimeOfDay = command.TimeOfDay,
                TimeZoneId = command.TimeZoneId,
                Days = WeekdaysExtensions.From(command.Days),
                CreatedAt = DateTimeOffset.UtcNow,
                CreatedBy = userId,
            };
            db.Reminders.Add(reminder);
            await db.SaveChangesAsync(ct);

            return Ok(ReminderModel.From(reminder));
        }
    }
}
