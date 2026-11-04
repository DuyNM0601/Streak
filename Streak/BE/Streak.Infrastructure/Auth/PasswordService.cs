using Microsoft.AspNetCore.Identity;
using Streak.Application.Abstractions;

namespace Streak.Infrastructure.Auth;

/// <summary>
/// Băm mật khẩu bằng PasswordHasher của .NET (PBKDF2 + salt ngẫu nhiên, tự nhúng tham số vào hash).
/// Chỉ dùng thư viện băm, không kéo theo ASP.NET Identity đầy đủ.
/// </summary>
public sealed class PasswordService : IPasswordService
{
    // PasswordHasher<T> không dùng tới đối tượng user, truyền string rỗng cho đủ chữ ký.
    private readonly PasswordHasher<string> _hasher = new();

    public string Hash(string password) => _hasher.HashPassword(string.Empty, password);

    public bool Verify(string hash, string password) =>
        _hasher.VerifyHashedPassword(string.Empty, hash, password)
            is PasswordVerificationResult.Success or PasswordVerificationResult.SuccessRehashNeeded;
}
