using System.Security.Claims;
using MediatR;
using Streak.Api.Shared;
using Streak.Application.Features.Auth.Commands;
using Streak.Application.Features.Auth.Queries;

namespace Streak.Api.Features.Auth;

public static class AuthEndpoints
{
    public static void MapAuthApi(this IEndpointRouteBuilder endpoints)
    {
        var group = endpoints.MapGroup("/auth");

        group.MapPost("/register", async (RegisterCommand command, ISender sender) =>
            (await sender.Send(command)).ToHttpResult());

        group.MapPost("/login", async (LoginCommand command, ISender sender) =>
            (await sender.Send(command)).ToHttpResult());

        group.MapGet("/me", async (ClaimsPrincipal principal, ISender sender) =>
        {
            // Program.cs đặt MapInboundClaims = false nên claim vẫn tên "sub" (không bị đổi sang ClaimTypes.NameIdentifier).
            var userId = principal.FindFirstValue("sub");
            if (userId is null)
                return Results.Unauthorized();

            return (await sender.Send(new GetCurrentUserQuery(userId))).ToHttpResult();
        }).RequireAuthorization();
    }
}
