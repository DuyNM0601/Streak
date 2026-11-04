using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Streak.Domain.Entities;

namespace Streak.Infrastructure.Entities;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Email).IsRequired().HasMaxLength(256);
        builder.Property(x => x.PasswordHash).IsRequired();
        builder.Property(x => x.DisplayName).IsRequired().HasMaxLength(100);
        builder.HasIndex(x => x.Email).IsUnique();
    }
}
