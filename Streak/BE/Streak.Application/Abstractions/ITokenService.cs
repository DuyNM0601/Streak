using Streak.Domain.Entities;

namespace Streak.Application.Abstractions;

public sealed record AccessToken(string Value, DateTimeOffset ExpiresAt);

/// <summary>Phát access token (JWT) cho 1 user. Infrastructure cài đặt.</summary>
public interface ITokenService
{
    AccessToken Create(User user);
}
