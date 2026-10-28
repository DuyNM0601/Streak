using FluentValidation;
using Microsoft.Extensions.DependencyInjection;

namespace Streak.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddMediatR(cfg =>
        {
            cfg.RegisterServicesFromAssemblyContaining(typeof(DependencyInjection));
            cfg.AddOpenBehavior(typeof(Shared.ValidationBehavior<,>));
        });

        services.AddValidatorsFromAssemblyContaining(typeof(DependencyInjection));

        return services;
    }
}
