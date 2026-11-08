using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Streak.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Streak.Infrastructure
{
    public static class DependencyInjections
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<AppDbContext>((servicesprovider, options) =>
            {
                options.UseSqlServer(configuration.GetConnectionString("DefaultConnection"));
            });
            return services;
        }
    }
}
