using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Streak.Application.Common;
using Streak.Application.Shared;
using Streak.Domain.Entities;

namespace Streak.Application.Features.Auth.Commands
{
    public sealed class LogoutCommandHandler(
        IAppDbContext db,
        ITokenService tokens,
        ILogger<LogoutCommandHandler> logger)
        : CommandHandler<LogoutCommand, Unit>(logger)
    {
        public override async Task<Result<Unit>> HandleAsync(LogoutCommand command, CancellationToken ct)
        {
            if (string.IsNullOrWhiteSpace(command.RefreshToken))
                return Ok(Unit.Value);

            string hash = tokens.HashRefreshToken(command.RefreshToken);
            RefreshToken? stored = await db.RefreshTokens.FirstOrDefaultAsync(x => x.TokenHash == hash && x.RevokedAt == null, ct);
            if (stored is not null)
            {
                stored.RevokedAt = DateTimeOffset.UtcNow;
                await db.SaveChangesAsync(ct);
            }

            return Ok(Unit.Value);
        }
    }
}
