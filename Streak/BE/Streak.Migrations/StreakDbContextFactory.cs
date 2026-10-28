using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Streak.Infrastructure;

namespace Streak.Migrations;

/// <summary>Chỉ dùng lúc thiết kế (dotnet ef migrations add / database update).</summary>
public class StreakDbContextFactory : IDesignTimeDbContextFactory<StreakDbContext>
{
    public StreakDbContext CreateDbContext(string[] args)
    {
        var builder = new DbContextOptionsBuilder<StreakDbContext>();
        builder.UseSqlServer(
            "Server=localhost;Database=Streak;Trusted_Connection=True;TrustServerCertificate=True;",
            b => b.MigrationsAssembly("Streak.Migrations"));
        return new StreakDbContext(builder.Options);
    }
}
