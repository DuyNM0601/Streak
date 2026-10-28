using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Streak.Domain.Entities;

namespace Streak.Infrastructure.Entities;

/// <summary>
/// Cấu hình map entity sang bảng SQL. Entity ở Streak.Domain không biết gì về chỗ này.
/// </summary>
public class StreakEntryConfiguration : IEntityTypeConfiguration<StreakEntry>
{
    public void Configure(EntityTypeBuilder<StreakEntry> builder)
    {
        builder.HasKey(x => x.Id);
        builder.HasIndex(x => new { x.UserId, x.CheckInDate }).IsUnique();
    }
}
