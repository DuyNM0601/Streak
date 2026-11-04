using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Streak.Application.Abstractions;
using Streak.Application.Shared;
using Streak.Domain.Models;

namespace Streak.Application.Features.Auth.Commands;

public sealed class LoginCommandHandler(
    IApplicationDbContext db,
    IPasswordService passwords,
    ITokenService tokens,
    ILogger<LoginCommandHandler> logger) : CommandHandler<LoginCommand, AuthResult>(logger)
{
    public override async Task<Result<AuthResult>> HandleAsync(LoginCommand command, CancellationToken ct)
    {
        var email = command.Email.Trim().ToLowerInvariant();
        var user = await db.Users.FirstOrDefaultAsync(x => x.Email == email, ct);

        // Cùng 1 thông báo cho "sai email" và "sai mật khẩu" để không lộ email nào đã đăng ký.
        if (user is null || !passwords.Verify(user.PasswordHash, command.Password))
            return Fail(new Error("Unauthorized", "Email hoặc mật khẩu không đúng."));

        var token = tokens.Create(user);
        return Ok(new AuthResult(token.Value, token.ExpiresAt, new UserModel
        {
            Id = user.Id,
            Email = user.Email,
            DisplayName = user.DisplayName,
        }));
    }
}
