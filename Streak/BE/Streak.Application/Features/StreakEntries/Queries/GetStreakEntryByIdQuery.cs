using Streak.Application.Shared;
using Streak.Domain.Models;

namespace Streak.Application.Features.StreakEntries.Queries;

public sealed record GetStreakEntryByIdQuery(string Id) : IQuery<StreakEntryModel?>;
