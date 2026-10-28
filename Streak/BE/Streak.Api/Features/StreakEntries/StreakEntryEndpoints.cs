using MediatR;
using Streak.Application.Features.StreakEntries.Commands;
using Streak.Application.Features.StreakEntries.Queries;
using Streak.Api.Shared;

namespace Streak.Api.Features.StreakEntries;

public static class StreakEntryEndpoints
{
    public static void MapStreakEntryApi(this IEndpointRouteBuilder endpoints)
    {
        var group = endpoints.MapGroup("/streak-entries");

        // TODO: .RequireAuthorization() + permission attribute khi có hệ thống auth riêng cho Streak.

        group.MapPost("/", async (CreateStreakEntryCommand command, ISender sender) =>
        {
            var result = await sender.Send(command);
            return result.ToCreatedResult("/streak-entries");
        });

        group.MapGet("/{id}", async (string id, ISender sender) =>
        {
            var result = await sender.Send(new GetStreakEntryByIdQuery(id));
            return result.ToFoundResult();
        });

        group.MapGet("/", async (string? userId, ISender sender, int skip = 0, int top = 20) =>
        {
            var result = await sender.Send(new SearchStreakEntriesQuery(userId, skip, top == 0 ? 20 : top));
            return result.ToHttpResult();
        });
    }
}
