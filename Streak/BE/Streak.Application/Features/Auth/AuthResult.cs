using Streak.Domain.Models;

namespace Streak.Application.Features.Auth;

public sealed record AuthResult(string AccessToken, DateTimeOffset ExpiresAt, UserModel User);
