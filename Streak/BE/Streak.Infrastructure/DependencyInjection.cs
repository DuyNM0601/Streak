using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Streak.Application.Abstractions;
using Streak.Infrastructure.Auth;

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

        services.AddOptions<JwtOptions>()
            .Bind(configuration.GetSection(JwtOptions.SectionName))
            .Validate(o => o.Key.Length >= 32, "Jwt:Key phải có tối thiểu 32 ký tự (đặt bằng user-secrets, không đặt trong appsettings).")
            .ValidateOnStart();

        services.AddSingleton<IPasswordService, PasswordService>();
        services.AddSingleton<ITokenService, JwtTokenService>();

        return services;
    }
}
