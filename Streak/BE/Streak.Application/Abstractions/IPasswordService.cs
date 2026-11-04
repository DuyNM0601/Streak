namespace Streak.Application.Abstractions;

/// <summary>Băm và kiểm tra mật khẩu. Infrastructure cài đặt, Application chỉ biết interface.</summary>
public interface IPasswordService
{
    string Hash(string password);

    bool Verify(string hash, string password);
}
