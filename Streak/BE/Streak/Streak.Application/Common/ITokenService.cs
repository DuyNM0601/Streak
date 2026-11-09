using Streak.Domain.Entities;

namespace Streak.Application.Common
{
    public sealed record AccessToken(string Value, DateTimeOffset ExpiresAt);

    public interface ITokenService
    {
        AccessToken Create(User user);
    }
}
