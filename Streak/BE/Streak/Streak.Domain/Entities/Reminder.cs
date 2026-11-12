using System.ComponentModel.DataAnnotations;

namespace Streak.Domain.Entities;

public class Reminder : BaseEntity, IAuditable, ISoftDelete
{
    [MaxLength(36)]
    public string UserId { get; set; } = default!;

    [MaxLength(200)]
    public string Title { get; set; } = default!;

    /// <summary>Giờ nhắc theo giờ địa phương của người dùng (05:00 là 5 giờ sáng ở múi giờ của họ, không phải UTC).</summary>
    public TimeOnly TimeOfDay { get; set; }

    /// <summary>Id múi giờ IANA, ví dụ "Asia/Ho_Chi_Minh". Cần để đổi giờ địa phương sang thời điểm thật khi gửi nhắc.</summary>
    [MaxLength(64)]
    public string TimeZoneId { get; set; } = default!;

    public Weekdays Days { get; set; }

    public bool IsActive { get; set; } = true;

    public DateTimeOffset CreatedAt { get; set; }

    [MaxLength(36)]
    public string? CreatedBy { get; set; }

    public DateTimeOffset? UpdatedAt { get; set; }

    [MaxLength(36)]
    public string? UpdatedBy { get; set; }

    public DateTimeOffset? DeletedAt { get; set; }

    [MaxLength(36)]
    public string? DeletedBy { get; set; }
}
