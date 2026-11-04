namespace Streak.Domain.Models;

/// <summary>DTO trả ra ngoài - không có PasswordHash, không lộ Entity qua API.</summary>
public class UserModel
{
    public string Id { get; set; } = default!;
    public string Email { get; set; } = default!;
    public string DisplayName { get; set; } = default!;
}
