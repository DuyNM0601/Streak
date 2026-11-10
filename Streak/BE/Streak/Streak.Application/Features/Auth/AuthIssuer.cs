using Streak.Application.Common;
using Streak.Application.Features.Auth.Models;
using Streak.Domain.Entities;

namespace Streak.Application.Features.Auth
{
    /// <summary>Dùng chung cho đăng nhập và làm mới: phát access token + refresh token mới, thêm dòng RefreshToken vào db (chưa lưu).</summary>
    internal static class AuthIssuer
    {
        /// <param name="familyId">Truyền FamilyId của token cũ khi xoay; null khi đăng nhập mới (mở họ mới).</param>
        public static (AuthModel Model, RefreshToken Stored) Issue(User user, ITokenService tokens, IAppDbContext db, string? familyId = null)
        {
            AccessToken access = tokens.Create(user);
            NewRefreshToken refresh = tokens.CreateRefreshToken();

            var stored = new RefreshToken
            {
                UserId = user.Id,
                TokenHash = refresh.Hash,
                CreatedAt = DateTimeOffset.UtcNow,
                ExpiresAt = refresh.ExpiresAt,
            };
            stored.FamilyId = familyId ?? stored.Id;
            db.RefreshTokens.Add(stored);

            var model = new AuthModel
            {
                AccessToken = access.Value,
                ExpiresAt = access.ExpiresAt,
                UserId = user.Id,
                Email = user.Email,
                DisplayName = user.DisplayName,
                AvatarUrl = user.AvatarUrl,
                RefreshToken = refresh.Value,
                RefreshTokenExpiresAt = refresh.ExpiresAt,
            };
            return (model, stored);
        }
    }
}
