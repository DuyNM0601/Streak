namespace Streak.Domain.Entities;

/// <summary>Entity thật của nghiệp vụ. Không tham chiếu EF Core hay bất kỳ project nào khác.</summary>
public class StreakEntry
{
    public string Id { get; set; } = Guid.NewGuid().ToString();

    public string UserId { get; set; } = default!;

    public DateOnly CheckInDate { get; set; }

    public int CurrentCount { get; set; }

    public DateTimeOffset CreatedAt { get; set; }

    public DateTimeOffset UpdatedAt { get; set; }
}
