using System.Security.Cryptography;
using System.Text;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;
using Streak.Application.Common;
using Streak.Domain.Entities;

namespace Streak.Infrastructure.Auth
{
    public sealed class JwtTokenService(JwtOptions options) : ITokenService
    {
        public AccessToken Create(User user)
        {
            if (options.Key.Length < 32)
                throw new InvalidOperationException("Jwt:Key must be at least 32 characters (set it with user-secrets, not in appsettings).");

            DateTimeOffset expiresAt = DateTimeOffset.UtcNow.AddMinutes(options.ExpiresMinutes);

            var descriptor = new SecurityTokenDescriptor
            {
                Issuer = options.Issuer,
                Audience = options.Audience,
                Expires = expiresAt.UtcDateTime,
                Claims = new Dictionary<string, object>
                {
                    [JwtRegisteredClaimNames.Sub] = user.Id,
                    [JwtRegisteredClaimNames.Email] = user.Email,
                    [JwtRegisteredClaimNames.Name] = user.DisplayName,
                },
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(Encoding.UTF8.GetBytes(options.Key)),
                    SecurityAlgorithms.HmacSha256),
            };

            return new AccessToken(new JsonWebTokenHandler().CreateToken(descriptor), expiresAt);
        }

        public NewRefreshToken CreateRefreshToken()
        {
            string value = Base64UrlEncoder.Encode(RandomNumberGenerator.GetBytes(32));
            return new NewRefreshToken(value, HashRefreshToken(value), DateTimeOffset.UtcNow.AddDays(options.RefreshExpiresDays));
        }

        // Token là 256 bit ngẫu nhiên nên SHA-256 thường là đủ, không cần băm chậm như mật khẩu.
        public string HashRefreshToken(string value) =>
            Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(value)));
    }
}
