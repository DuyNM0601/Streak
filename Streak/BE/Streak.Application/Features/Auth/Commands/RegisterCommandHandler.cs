using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Streak.Application.Abstractions;
using Streak.Application.Shared;
using Streak.Domain.Entities;
using Streak.Domain.Models;

namespace Streak.Application.Features.Auth.Commands;

public sealed class RegisterCommandHandler(
    IApplicationDbContext db,
    IPasswordService passwords,
    ITokenService tokens,
    ILogger<RegisterCommandHandler> logger) : CommandHandler<RegisterCommand, AuthResult>(logger)
{
    public override async Task<Result<AuthResult>> HandleAsync(RegisterCommand command, CancellationToken ct)
    {
        var email = command.Email.Trim().ToLowerInvariant();

        if (await db.Users.AnyAsync(x => x.Email == email, ct))
            return Fail(new Error("Conflict", "Email này đã được đăng ký."));

        var user = new User
        {
            Email = email,
            PasswordHash = passwords.Hash(command.Password),
            DisplayName = command.DisplayName.Trim(),
        };

        db.Users.Add(user);
        await db.SaveChangesAsync(ct);

        var token = tokens.Create(user);
        return Ok(new AuthResult(token.Value, token.ExpiresAt, new UserModel
        {
            Id = user.Id,
            Email = user.Email,
            DisplayName = user.DisplayName,
        }));
    }
}
