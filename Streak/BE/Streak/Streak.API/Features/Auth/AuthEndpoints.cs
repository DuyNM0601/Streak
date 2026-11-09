using MediatR;
using Microsoft.AspNetCore.Mvc;
using Streak.API.Shared;
using Streak.Application.Features.Auth.Commands;

namespace Streak.API.Features.Auth
{
    public static class AuthEndpoints
    {
        public static void MapAuthApi(this IEndpointRouteBuilder endpoints)
        {
            var group = endpoints.MapGroup("/auth");

            // Đăng nhập bằng ID token Google do FE lấy từ Google Sign-In. Trả JWT của hệ thống.
            group.MapPost("/google", async (
                [FromBody] GoogleLoginCommand command,
                ISender sender) =>
            {
                var result = await sender.Send(command);
                return result.ToHttpResult();
            });
        }
    }
}
