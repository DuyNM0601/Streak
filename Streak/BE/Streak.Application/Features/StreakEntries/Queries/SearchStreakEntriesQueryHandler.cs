using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Streak.Application.Abstractions;
using Streak.Application.Shared;
using Streak.Domain.Models;

namespace Streak.Application.Features.StreakEntries.Queries;

public sealed class SearchStreakEntriesQueryHandler(
    IApplicationDbContext db,
    ILogger<SearchStreakEntriesQueryHandler> logger) : QueryHandler<SearchStreakEntriesQuery, SearchStreakEntriesResult>(logger)
{
    public override async Task<Result<SearchStreakEntriesResult>> HandleAsync(SearchStreakEntriesQuery query, CancellationToken ct)
    {
        var baseQuery = db.StreakEntries.AsNoTracking().AsQueryable();

        if (!string.IsNullOrWhiteSpace(query.UserId))
            baseQuery = baseQuery.Where(x => x.UserId == query.UserId);

        var total = await baseQuery.CountAsync(ct);

        var items = await baseQuery
            .OrderByDescending(x => x.CheckInDate)
            .Skip(query.Skip)
            .Take(query.Top)
            .Select(x => new StreakEntryModel
            {
                Id = x.Id,
                UserId = x.UserId,
                CheckInDate = x.CheckInDate,
                CurrentCount = x.CurrentCount
            })
            .ToListAsync(ct);

        return Ok(new SearchStreakEntriesResult(items, total));
    }
}
