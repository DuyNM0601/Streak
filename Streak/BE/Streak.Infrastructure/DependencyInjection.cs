using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Streak.Application.Abstractions;

namespace Streak.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<StreakDbContext>(options => options
            .UseSqlServer(
                configuration.GetConnectionString("Default"),
                sql => sql.UseQuerySplittingBehavior(QuerySplittingBehavior.SplitQuery)));

        services.AddScoped<IApplicationDbContext>(sp => sp.GetRequiredService<StreakDbContext>());

        return services;
    }
}
