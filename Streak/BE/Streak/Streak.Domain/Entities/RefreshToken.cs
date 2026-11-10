using System.ComponentModel.DataAnnotations;

namespace Streak.Domain.Entities;

/// <summary>Refresh token của một phiên đăng nhập. Chỉ lưu bản băm, giá trị gốc chỉ nằm trong cookie của client.</summary>
public class RefreshToken : BaseEntity
{
    [MaxLength(36)]
    public string UserId { get; set; } = default!;

    /// <summary>Mọi token xoay ra từ cùng một lần đăng nhập (một thiết bị) có chung FamilyId; phát hiện đánh cắp chỉ thu hồi cả "họ" này, không đụng thiết bị khác.</summary>
    [MaxLength(36)]
    public string FamilyId { get; set; } = default!;

    /// <summary>SHA-256 của token, dạng hex (64 ký tự).</summary>
    [MaxLength(64)]
    public string TokenHash { get; set; } = default!;

    public DateTimeOffset CreatedAt { get; set; }

    public DateTimeOffset ExpiresAt { get; set; }

    /// <summary>Có giá trị khi token đã bị xoay (đổi lấy token mới) hoặc đăng xuất.</summary>
    public DateTimeOffset? RevokedAt { get; set; }

    /// <summary>Id của token thay thế khi xoay; null nếu bị thu hồi do đăng xuất.</summary>
    [MaxLength(36)]
    public string? ReplacedById { get; set; }
}
