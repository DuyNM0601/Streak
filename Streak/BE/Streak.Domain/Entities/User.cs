namespace Streak.Domain.Entities;

/// <summary>Người dùng của Streak. Chỉ giữ hash mật khẩu, không bao giờ giữ mật khẩu gốc.</summary>
public class User
{
    public string Id { get; set; } = Guid.NewGuid().ToString();

    /// <summary>Luôn lưu chữ thường để so sánh trùng email không phân biệt hoa/thường.</summary>
    public string Email { get; set; } = default!;

    public string PasswordHash { get; set; } = default!;

    public string DisplayName { get; set; } = default!;

    public DateTimeOffset CreatedAt { get; set; }

    public DateTimeOffset UpdatedAt { get; set; }
}
