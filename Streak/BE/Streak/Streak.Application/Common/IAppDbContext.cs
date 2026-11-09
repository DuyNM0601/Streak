using Microsoft.EntityFrameworkCore;
using Streak.Domain.Entities;

namespace Streak.Application.Common
{
    public interface IAppDbContext
    {
        DbSet<User> Users { get; }

        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    }
}
