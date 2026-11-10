using System.Security.Claims;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.JsonWebTokens;
using Streak.API.Shared;
using Streak.Application.Features.Auth.Commands;
using Streak.Application.Features.Auth.Models;
using Streak.Application.Shared;

namespace Streak.API.Features.Auth
{
    public static class AuthEndpoints
    {
        private const string RefreshCookie = "refresh_token";

        public static void MapAuthApi(this IEndpointRouteBuilder endpoints)
        {
            var group = endpoints.MapGroup("/auth");

            // Đăng nhập bằng ID token Google do FE lấy từ Google Sign-In. Trả JWT của hệ thống,
            // refresh token đi riêng trong cookie HttpOnly.
            group.MapPost("/google", async (
                [FromBody] GoogleLoginCommand command,
                ISender sender,
                HttpContext http) =>
            {
                var result = await sender.Send(command);
                return Respond(result, http);
            })
            // Khai báo kiểu phản hồi để trang tài liệu (Scalar) hiện đủ 200/400/401.
            .Produces<AuthModel>()
            .ProducesValidationProblem()
            .ProducesProblem(StatusCodes.Status401Unauthorized);

            // Đổi refresh token (cookie) lấy access token mới, đồng thời xoay refresh token.
            group.MapPost("/refresh", async (ISender sender, HttpContext http) =>
            {
                var result = await sender.Send(new RefreshTokenCommand(http.Request.Cookies[RefreshCookie]));
                if (!result.IsSuccess)
                    http.Response.Cookies.Delete(RefreshCookie, RefreshCookieOptions(null));
                return Respond(result, http);
            })
            .Produces<AuthModel>()
            .ProducesProblem(StatusCodes.Status401Unauthorized);

            // Thu hồi refresh token của phiên này và xoá cookie.
            group.MapPost("/logout", async (ISender sender, HttpContext http) =>
            {
                await sender.Send(new LogoutCommand(http.Request.Cookies[RefreshCookie]));
                http.Response.Cookies.Delete(RefreshCookie, RefreshCookieOptions(null));
                return Results.NoContent();
            })
            .Produces(StatusCodes.Status204NoContent);

            // Endpoint đầu tiên cần access token (Authorization: Bearer ...). Chỉ đọc lại claim trong token, không chạm database.
            group.MapGet("/me", (ClaimsPrincipal user) => Results.Ok(new
            {
                UserId = user.FindFirstValue(JwtRegisteredClaimNames.Sub),
                Email = user.FindFirstValue(JwtRegisteredClaimNames.Email),
                DisplayName = user.FindFirstValue(JwtRegisteredClaimNames.Name),
            }))
            .RequireAuthorization()
            .ProducesProblem(StatusCodes.Status401Unauthorized);
        }

        private static IResult Respond(Result<AuthModel> result, HttpContext http)
        {
            if (result.IsSuccess)
            {
                AuthModel model = result.Value!;
                http.Response.Cookies.Append(RefreshCookie, model.RefreshToken!, RefreshCookieOptions(model.RefreshTokenExpiresAt));
            }
            return result.ToHttpResult();
        }

        // shortcut: SameSite=None vì FE (http://localhost:3000) và API (https://localhost:7022) khác scheme/origin; khi FE và API
        // cùng site ở production thì đổi sang Lax/Strict. Path="/auth" để trình duyệt chỉ gửi cookie tới các endpoint này.
        private static CookieOptions RefreshCookieOptions(DateTimeOffset? expires) => new()
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.None,
            Path = "/auth",
            Expires = expires,
        };
    }
}
