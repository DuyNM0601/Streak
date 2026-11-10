using Streak.Domain.Entities;

namespace Streak.Application.Common
{
    public sealed record AccessToken(string Value, DateTimeOffset ExpiresAt);

    /// <summary>Value: giá trị gốc gửi cho client (cookie). Hash: bản băm lưu vào database.</summary>
    public sealed record NewRefreshToken(string Value, string Hash, DateTimeOffset ExpiresAt);

    public interface ITokenService
    {
        AccessToken Create(User user);

        NewRefreshToken CreateRefreshToken();

        /// <summary>Băm token client gửi lên để so với TokenHash trong database.</summary>
        string HashRefreshToken(string value);
    }
}
