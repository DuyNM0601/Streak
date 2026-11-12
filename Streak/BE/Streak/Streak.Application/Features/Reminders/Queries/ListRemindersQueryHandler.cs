using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Streak.Application.Common;
using Streak.Application.Features.Reminders.Models;
using Streak.Application.Shared;
using Streak.Domain.Entities;

namespace Streak.Application.Features.Reminders.Queries
{
    public sealed class ListRemindersQueryHandler(
        IAppDbContext db,
        ICurrentUser currentUser,
        ILogger<ListRemindersQueryHandler> logger)
        : QueryHandler<ListRemindersQuery, IReadOnlyList<ReminderModel>>(logger)
    {
        public override async Task<Result<IReadOnlyList<ReminderModel>>> HandleAsync(ListRemindersQuery query, CancellationToken ct)
        {
            if (currentUser.UserId is not { } userId)
                return Fail(Error.Unauthorized("You must be signed in."));

            List<Reminder> reminders = await db.Reminders
                .AsNoTracking()
                .Where(x => x.UserId == userId && x.DeletedAt == null)
                .OrderBy(x => x.TimeOfDay)
                .ToListAsync(ct);

            return Ok(reminders.Select(ReminderModel.From).ToList());
        }
    }
}
