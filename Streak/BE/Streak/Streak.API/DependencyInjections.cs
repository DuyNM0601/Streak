using Streak.API.Shared;
using Streak.Application.Common;

namespace Streak.API
{
    public static class DependencyInjections
    {
        public static IServiceCollection AddApi(this IServiceCollection services)
        {
            services.AddHttpContextAccessor();
            services.AddScoped<ICurrentUser, CurrentUser>();
            return services;
        }
    }
}
