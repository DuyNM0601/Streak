using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Streak.Application.Abstractions;
using Streak.Application.Shared;
using Streak.Domain.Models;

namespace Streak.Application.Features.StreakEntries.Queries;

public sealed class GetStreakEntryByIdQueryHandler(
    IApplicationDbContext db,
    ILogger<GetStreakEntryByIdQueryHandler> logger) : QueryHandler<GetStreakEntryByIdQuery, StreakEntryModel?>(logger)
{
    public override async Task<Result<StreakEntryModel?>> HandleAsync(GetStreakEntryByIdQuery query, CancellationToken ct)
    {
        var entity = await db.StreakEntries
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == query.Id, ct);

        if (entity is null)
            return Ok(null);

        return Ok(new StreakEntryModel
        {
            Id = entity.Id,
            UserId = entity.UserId,
            CheckInDate = entity.CheckInDate,
            CurrentCount = entity.CurrentCount
        });
    }
}
