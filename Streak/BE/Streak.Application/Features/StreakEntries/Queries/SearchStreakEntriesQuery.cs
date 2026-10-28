using Streak.Application.Shared;
using Streak.Domain.Models;

namespace Streak.Application.Features.StreakEntries.Queries;

public sealed record SearchStreakEntriesQuery(string? UserId, int Skip, int Top) : IQuery<SearchStreakEntriesResult>;

public sealed record SearchStreakEntriesResult(List<StreakEntryModel> Items, int TotalCount);
