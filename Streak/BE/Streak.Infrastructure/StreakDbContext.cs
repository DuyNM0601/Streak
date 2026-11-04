using Microsoft.EntityFrameworkCore;
using Streak.Application.Abstractions;
using Streak.Domain.Entities;

namespace Streak.Infrastructure;

public class StreakDbContext(DbContextOptions<StreakDbContext> options) : DbContext(options), IApplicationDbContext
{
    public DbSet<User> Users => Set<User>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(StreakDbContext).Assembly);
    }

    // Thay cho AuditInterceptor của BuildingBlocks: tự set CreatedAt/UpdatedAt mỗi lần lưu.
    public override Task<int> SaveChangesAsync(CancellationToken ct = default)
    {
        var now = DateTimeOffset.UtcNow;
        foreach (var entry in ChangeTracker.Entries<User>())
        {
            if (entry.State == EntityState.Added) entry.Entity.CreatedAt = now;
            if (entry.State is EntityState.Added or EntityState.Modified) entry.Entity.UpdatedAt = now;
        }
        return base.SaveChangesAsync(ct);
    }
}
