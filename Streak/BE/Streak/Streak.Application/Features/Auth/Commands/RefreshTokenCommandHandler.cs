using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Streak.Application.Common;
using Streak.Application.Features.Auth.Models;
using Streak.Application.Shared;
using Streak.Domain.Entities;

namespace Streak.Application.Features.Auth.Commands
{
    public sealed class RefreshTokenCommandHandler(
        IAppDbContext db,
        ITokenService tokens,
        ILogger<RefreshTokenCommandHandler> logger)
        : CommandHandler<RefreshTokenCommand, AuthModel>(logger)
    {
        public override async Task<Result<AuthModel>> HandleAsync(RefreshTokenCommand command, CancellationToken ct)
        {
            if (string.IsNullOrWhiteSpace(command.RefreshToken))
                return Fail(Error.Unauthorized("The refresh token is missing."));

            string hash = tokens.HashRefreshToken(command.RefreshToken);
            RefreshToken? stored = await db.RefreshTokens.FirstOrDefaultAsync(x => x.TokenHash == hash, ct);
            if (stored is null)
                return Fail(Error.Unauthorized("The refresh token is invalid."));

            DateTimeOffset now = DateTimeOffset.UtcNow;

            if (stored.RevokedAt is not null)
            {
                // Token đã xoay hoặc đã đăng xuất mà vẫn có người đem dùng lại => nghi bị đánh cắp,
                // thu hồi cả "họ" token của lần đăng nhập đó (thiết bị đó), buộc đăng nhập lại. Thiết bị khác của user không bị ảnh hưởng.
                List<RefreshToken> active = await db.RefreshTokens
                    .Where(x => x.FamilyId == stored.FamilyId && x.RevokedAt == null)
                    .ToListAsync(ct);
                foreach (RefreshToken token in active)
                    token.RevokedAt = now;
                await db.SaveChangesAsync(ct);

                Logger.LogWarning("Revoked refresh token reused for user {UserId}; revoked {Count} active tokens of family {FamilyId}.", stored.UserId, active.Count, stored.FamilyId);
                return Fail(Error.Unauthorized("The refresh token is no longer valid."));
            }

            if (stored.ExpiresAt <= now)
                return Fail(Error.Unauthorized("The refresh token has expired."));

            User? user = await db.Users.FirstOrDefaultAsync(x => x.Id == stored.UserId && x.DeletedAt == null, ct);
            if (user is null)
                return Fail(Error.Unauthorized("This account is not available."));

            // Xoay vòng: mỗi lần làm mới, token cũ bị thu hồi và đổi lấy token mới.
            var (model, next) = AuthIssuer.Issue(user, tokens, db, stored.FamilyId);
            stored.RevokedAt = now;
            stored.ReplacedById = next.Id;
            await db.SaveChangesAsync(ct);

            return Ok(model);
        }
    }
}
