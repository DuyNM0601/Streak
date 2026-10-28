namespace Streak.Domain.Models;

/// <summary>DTO trả ra ngoài, không lộ Entity thật. Dùng ở các query trả về.</summary>
public class StreakEntryModel
{
    public string? Id { get; set; }

    public string UserId { get; set; } = default!;

    public DateOnly CheckInDate { get; set; }

    public int CurrentCount { get; set; }
}
