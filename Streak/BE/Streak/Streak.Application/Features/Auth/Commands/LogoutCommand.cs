using MediatR;
using Streak.Application.Shared;

namespace Streak.Application.Features.Auth.Commands
{
    /// <summary>Thu hồi refresh token của phiên hiện tại. Luôn thành công (idempotent), kể cả khi token không tồn tại.</summary>
    public sealed record LogoutCommand(string? RefreshToken) : ICommand<Unit>;
}
