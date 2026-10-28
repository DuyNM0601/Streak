using Streak.Application.Shared;

namespace Streak.Application.Features.StreakEntries.Commands;

public sealed record CreateStreakEntryCommand(string UserId, DateOnly CheckInDate) : ICommand<string>;
