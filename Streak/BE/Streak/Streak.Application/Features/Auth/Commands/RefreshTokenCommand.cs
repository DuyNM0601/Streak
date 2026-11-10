using Streak.Application.Features.Auth.Models;
using Streak.Application.Shared;

namespace Streak.Application.Features.Auth.Commands
{
    /// <summary>RefreshToken do tầng API đọc từ cookie rồi truyền vào, null nếu không có cookie.</summary>
    public sealed record RefreshTokenCommand(string? RefreshToken) : ICommand<AuthModel>;
}
