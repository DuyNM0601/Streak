using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Streak.Application.Common;
using Streak.Application.Features.Auth.Models;
using Streak.Application.Shared;
using Streak.Domain.Entities;

namespace Streak.Application.Features.Auth.Commands
{
    public sealed class GoogleLoginCommandHandler(
        IAppDbContext db,
        IGoogleTokenVerifier googleVerifier,
        ITokenService tokens,
        ILogger<GoogleLoginCommandHandler> logger)
        : CommandHandler<GoogleLoginCommand, AuthModel>(logger)
    {
        public override async Task<Result<AuthModel>> HandleAsync(GoogleLoginCommand command, CancellationToken ct)
        {
            if (string.IsNullOrWhiteSpace(command.IdToken))
                return Fail(nameof(command.IdToken), "IdToken is required.");

            GoogleProfile? profile = await googleVerifier.VerifyAsync(command.IdToken, ct);
            if (profile is null)
                return Fail(Error.Unauthorized("The Google ID token is invalid."));

            User? user = await db.Users.FirstOrDefaultAsync(x => x.ExternalId == profile.Subject, ct);

            if (user is null)
            {
                user = new User
                {
                    ExternalId = profile.Subject,
                    Email = profile.Email,
                    DisplayName = profile.DisplayName,
                    AvatarUrl = profile.PictureUrl,
                    CreatedAt = DateTimeOffset.UtcNow,
                };
                db.Users.Add(user);
                await db.SaveChangesAsync(ct);
            }
            else if (user.DeletedAt is not null)
            {
                return Fail(Error.Unauthorized("This account has been deleted."));
            }
            else if (user.Email != profile.Email || user.DisplayName != profile.DisplayName || user.AvatarUrl != profile.PictureUrl)
            {
                // Hồ sơ Google có thể đổi (tên, ảnh, email) - đồng bộ lại mỗi lần đăng nhập.
                user.Email = profile.Email;
                user.DisplayName = profile.DisplayName;
                user.AvatarUrl = profile.PictureUrl;
                user.UpdatedAt = DateTimeOffset.UtcNow;
                await db.SaveChangesAsync(ct);
            }

            AccessToken token = tokens.Create(user);
            return Ok(new AuthModel
            {
                AccessToken = token.Value,
                ExpiresAt = token.ExpiresAt,
                UserId = user.Id,
                Email = user.Email,
                DisplayName = user.DisplayName,
                AvatarUrl = user.AvatarUrl,
            });
        }
    }
}
