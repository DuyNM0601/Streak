using Microsoft.EntityFrameworkCore;
using Streak.Domain.Entities;

namespace Streak.Application.Abstractions;

/// <summary>
/// Cổng duy nhất để Application chạm tới dữ liệu. Application không biết StreakDbContext thật là gì,
/// chỉ biết interface này - Infrastructure cài đặt nó.
/// </summary>
public interface IApplicationDbContext
{
    DbSet<StreakEntry> StreakEntries { get; }

    DbSet<User> Users { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}
