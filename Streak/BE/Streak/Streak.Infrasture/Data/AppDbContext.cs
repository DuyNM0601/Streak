using Microsoft.EntityFrameworkCore;
using Streak.Application.Common;
using Streak.Domain.Entities;

namespace Streak.Infrastructure.Data
{
    public class AppDbContext : DbContext, IAppDbContext
    {
        public DbSet<User> Users { get; set; }

        public DbSet<RefreshToken> RefreshTokens { get; set; }

        public DbSet<Reminder> Reminders { get; set; }

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Tra token theo TokenHash ở mỗi lần làm mới nên cần unique index.
            modelBuilder.Entity<RefreshToken>().HasIndex(x => x.TokenHash).IsUnique();
            modelBuilder.Entity<RefreshToken>().HasIndex(x => x.FamilyId);
            modelBuilder.Entity<RefreshToken>().HasOne<User>().WithMany().HasForeignKey(x => x.UserId);

            // Danh sách nhắc nhở luôn lọc theo UserId.
            modelBuilder.Entity<Reminder>().HasIndex(x => x.UserId);
            modelBuilder.Entity<Reminder>().HasOne<User>().WithMany().HasForeignKey(x => x.UserId);
        }
    }
}
