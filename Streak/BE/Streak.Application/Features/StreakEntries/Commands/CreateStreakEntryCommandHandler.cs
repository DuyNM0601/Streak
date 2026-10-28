using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Streak.Application.Abstractions;
using Streak.Application.Shared;
using Streak.Domain.Entities;

namespace Streak.Application.Features.StreakEntries.Commands;

public sealed class CreateStreakEntryCommandHandler(
    IApplicationDbContext db,
    ILogger<CreateStreakEntryCommandHandler> logger) : CommandHandler<CreateStreakEntryCommand, string>(logger)
{
    public override async Task<Result<string>> HandleAsync(CreateStreakEntryCommand command, CancellationToken ct)
    {
        var exists = await db.StreakEntries.AnyAsync(
            x => x.UserId == command.UserId && x.CheckInDate == command.CheckInDate, ct);

        if (exists)
            return Fail(new Error("Duplicate", $"User '{command.UserId}' already checked in on {command.CheckInDate}."));

        var previous = await db.StreakEntries
            .Where(x => x.UserId == command.UserId && x.CheckInDate == command.CheckInDate.AddDays(-1))
            .FirstOrDefaultAsync(ct);

        var entity = new StreakEntry
        {
            UserId = command.UserId,
            CheckInDate = command.CheckInDate,
            CurrentCount = (previous?.CurrentCount ?? 0) + 1,
        };

        db.StreakEntries.Add(entity);
        await db.SaveChangesAsync(ct);

        return Ok(entity.Id);
    }
}
